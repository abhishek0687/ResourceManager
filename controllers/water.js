var db = require('../core/db');
var httpMsgs = require('../core/httpMsgs');
var util = require('util');


exports.getCourses = function(req,resp){
	db.dbs.collection("water").find().toArray(function(err,result){
							if(err){
								httpMsgs.show500(req,resp,err);
							}						
							else{
								httpMsgs.sendJson(req,resp,result);
							}
	});
};


exports.addCourses = function(req,resp,reqBody){
	db.dbs.collection("courses").find({category:reqBody.category}).toArray(function(err,data){
		if(!err && data.length==0){
			db.dbs.collection("courses").insert(reqBody,function(err,result){
				if(err){
					httpMsgs.show500(req,resp,err);
				}						
				else{
					httpMsgs.send200(req,resp);
				}
			});
		}
		else{
			httpMsgs.customError(req,resp,err,data);
		}
	})
};


exports.addWaterLevel = function(req,resp,reqBody){
	db.dbs.collection("water").find({"deviceId": reqBody.deviceId}).toArray(function(err,data){
		var dt = new Date();
		var dateFormat = dt.getDate()+"-"+dt.getMonth()+1+"-"+dt.getFullYear()+" "+dt.getHours()+":"+dt.getMinutes()+":"+dt.getSeconds();
		reqBody.date= dateFormat;
		console.log(reqBody);
		
		if(!err && data.length==0){
			db.dbs.collection("water").insert(reqBody,function(err,result){
				if(err){
					httpMsgs.show500(req,resp,err);
				}						
				else{
					httpMsgs.send200(req,resp);
				}
			});
		} 
		else if(!err && data.length !=0){
			db.dbs.collection("water").update({"deviceId": reqBody.deviceId},{$set:{date:reqBody.date,level:reqBody.level}}, function(err, data) {
				if(!err){
					httpMsgs.send200(req,resp);
					console.log(data);
				}
				else{
					httpMsgs.show500(req,resp,err);	
				}
		  });

		}
		else{
			httpMsgs.show500(req,resp,err);	
		}

	});
};


exports.getWaterLevel = function(req,resp,deviceId){
	db.dbs.collection("water").find({"deviceId": deviceId}).sort({"date":-1}).limit(1).toArray(function(err,data){
		if(err){
			httpMsgs.show500(req,resp,err);
		}						
		else{
			//data.date = data.date.toLocaleString();
			//console.log(data.date);
			httpMsgs.sendJson(req,resp,data);
		}
	})
};


