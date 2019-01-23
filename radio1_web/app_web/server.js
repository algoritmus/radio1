const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;

var db;

var MONGOHOST = process.env.MONGOHOST
var MONGOPORT = process.env.MONGOPORT

MongoClient.connect('mongodb://' + MONGOHOST + ':' + MONGOPORT,(err,client) => {
        if (err) return console.log(err);
        db = client.db('radio1');

        app.listen(3000,function() {
                console.log('Listen on port 3000')
        })
        app.set('view engine','ejs');
})
app.get('/',(req,res)=>{
        db.collection('tracks').find().toArray((err,result)=>{
                res.render('index.ejs',{tracks: result});
        })


});

app.get('/logs',(req,res)=>{
        db.collection('log').find().sort({'query date':1,'query time':1}).toArray((err,result)=>{
                res.render('logs.ejs',{logs: result});
        })


});

app.get('/top10',(req,res)=>{
        db.collection('tracks').aggregate([
		{'$group' : {'_id':{'author':'$author','title':'$title'}, 'count':{'$sum':1}}},{'$sort':{'count':-1}}
	]).toArray((err,result)=>{
                res.render('top.ejs',{tracks: result});
        })


});
app.get('/migrate/:s/:r',(req,res)=>{
        var s = req.params.s;
	var r = req.params.r;
	var wresults=[];
	
	db.collection('tracks').find({'date':s}).sort({'date':-1}).toArray((err,results)=>{
                
		for (var i=0; i < results.length; i++){
	          var nid=results[i].id.replace(s,r);
		  var wr = db.collection('tracks').update(
	  	    {'id':results[i].id},
		    {'date':r,
		     'id':nid
		    },
		    {upsert:false}
		  )	
		 
		  wresults[i] = {'nMatched':wr.nMatched,
				 'nModified':wr.nModified
				}	
		};
		
		res.render('migration.ejs',{corrected: wresults});
        })


});
app.get('/fill',(req,res)=>{
       
	
	db.collection('tracks').find({'author':''}).sort({'date':-1}).toArray((err,results)=>{
                
		for (var i=0; i < results.length; i++){
	          var author=results[i].id.split('-')[0];
		  var title=results[i].id.split('-')[1];
		  var time=results[i].id.split('-')[2];
		  var wr = db.collection('tracks').update(
	  	    {'id':results[i].id},
		    {'date':results[i].date,
		     'id':results[i].id,
		     'author':author,
		     'title':title,
		     'time':time
		    },
		    {upsert:false}
		  )	
		 
		  wresults[i] = {'nMatched':wr.nMatched,
				 'nModified':wr.nModified
				}	
		};
		
		res.render('migration.ejs',{corrected: wresults});
        })


});



