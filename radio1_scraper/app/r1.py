import os
import logging
from datetime import date, timedelta, datetime
from pyvirtualdisplay import Display
from selenium import webdriver
from pymongo import MongoClient
logging.getLogger().setLevel(logging.INFO)

BASE_URL = 'http://radio1.hu/'

client = MongoClient('mongodb://192.168.0.222:27017')
db = client.radio1


def firefox_example():
    display = Display(visible=0, size=(800, 600))
    display.start()
    logging.info('Initialized virtual display..')

    firefox_profile = webdriver.FirefoxProfile()
    firefox_profile.set_preference('browser.download.folderList', 2)
    firefox_profile.set_preference('browser.download.manager.showWhenStarting', False)
    firefox_profile.set_preference('browser.download.dir', os.getcwd())
    firefox_profile.set_preference('browser.helperApps.neverAsk.saveToDisk', 'text/csv')

    logging.info('Prepared firefox profile..')

    browser = webdriver.Firefox(firefox_profile=firefox_profile)
    logging.info('Initialized firefox browser..')

    browser.get(BASE_URL)
    logging.info('Accessed %s ..', BASE_URL)

    logging.info('Page title: %s', browser.title)
    
    getTrackInfos(browser)
    
    browser.quit()
    display.stop()


def getTrackInfos(browser):
    tracks = browser.find_elements_by_class_name('track')
    today = date.today()
    yesterday = date.today() - timedelta(1)
    query_time = datetime.now().strftime('%H:%M')
    query_date = today.strftime('%Y.%m.%d')   
    print(query_time)
    for track in tracks:
        trackInfo = track.find_element_by_class_name('track-info')
        author = trackInfo.find_element_by_class_name('author').text
        title = trackInfo.find_element_by_class_name('title').text
        
        trackTime = track.find_element_by_class_name('track-time')
        tt = trackTime.find_element_by_tag_name('span').text
        if(query_time > tt):
          datum = today.strftime('%Y.%m.%d')
        else:
          datum = yesterday.strftime('%Y.%m.%d')
        
        
	trackId = author + '-' + title + '-' + tt + '-' + datum
        trackData = {'id':trackId,'author':author,'title':title,'time':tt,'date':datum}
        logging.info(trackData)
        if not isExist(trackId):
          logging.info('Inserting: %s',trackData)
          db.tracks.insert_one(trackData)
          db.log.insert_one({'query time':query_time,'query date':query_date,'id':trackId,'action':'insert','reason':'new'})
        else:
          db.log.insert_one({'query time':query_time,'query date':query_date,'id':trackId,'reason':'already exists','action':'skip'})
            
       
def isExist(trackId):
    count = db.tracks.find({'id':trackId}).count()
    if db.tracks.find({'id':trackId}).count() == 0:
        logging.info(count) 
        return False
    else:
        logging.info(count)
        return True



if __name__ == '__main__':
    firefox_example()
