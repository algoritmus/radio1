FROM desyati/radio1_scraper:env 

RUN https://github.com/algoritmus/radio1.git
RUN cd radio1/radio1_scraper/app 
ENV APP_HOME /usr/src/app
WORKDIR /$APP_HOME

COPY . $APP_HOME/

CMD python3 example.py
