var MongoClient = require('mongodb').MongoClient;
var settings = require('../dbConfig');
var ObjectId = require('mongodb').ObjectID;


MongoClient.connect(settings.url,function(err,db){
	if(err){
		console.log('failed to connect mongo on url:' + settings.url);
	}
	else{
		console.log("succefully connected to DB");
		exports.dbs = db;
	}
});




	

