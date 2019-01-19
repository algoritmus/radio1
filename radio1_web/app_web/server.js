const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;

var db;

MongoClient.connect('mongodb://192.168.0.222:27017',(err,client) => {
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


})


