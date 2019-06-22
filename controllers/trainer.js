var db = require('../core/db');
var httpMsgs = require('../core/httpMsgs');
  var ObjectId = require('mongodb').ObjectID; 

exports.addTrainer=function(req,resp,reqBody){
	//db.dbs.collection(reqBody.serviceType).find({links:reqBody.links}).toArray(function(err,data){
		//if(!err && data.length==0){
			db.dbs.collection(reqBody.serviceType).insert(reqBody,function(err,result){
				if(err){
					httpMsgs.show500(req,resp,err);
				}						
				else{
					httpMsgs.send200(req,resp);
				}
			});
		//}
		//else{
		//	httpMsgs.customError(req,resp,err,data);
		//}
	//})
}


exports.getAllTrainer=function(req,resp,category){
	db.dbs.collection(category).find().toArray(function(err,data){
		if(err){
			httpMsgs.show500(req,resp,err);
		}						
		else{
			httpMsgs.sendJson(req,resp,data);
		}
	})
}


exports.getTrainer=function(req,resp,id,category){
	db.dbs.collection(category).find({"_id": new ObjectId(id)}).toArray(function(err,data){
		if(err){
			httpMsgs.show500(req,resp,err);
		}						
		else{
			httpMsgs.sendJson(req,resp,data);
		}
	})
}


exports.updateTrainer=function(req,resp,id,category,updatedData){
	db.dbs.collection(category).updateOne({"_id": new ObjectId(id)},{$set:{updatedData}}, function(err, data) {
		if(!err){
			httpMsgs.send200(req,resp);
			console.log(data);
		}
		else{
			httpMsgs.show500(req,resp,err);	
		}
  });
}

