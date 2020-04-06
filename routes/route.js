var bodyParser = require('body-parser');
var water = require('../controllers/water');
var db = require('../core/db');



exports.serve=function(app,express){

//	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({extended: true}));
	
	//app.get('/',function(req,resp){
	//	console.log("in /"+ __dirname);
	//	resp.write(JSON.stringify({"JAL":"Started server Successfully"}));	
	//	resp.end();		
	//})

	app.get('/water/:id',function(req,resp){		
		console.log(1);
		var deviceId = req.params.id;
		console.log(deviceId);
		water.getWaterLevel(req,resp,deviceId);
	});

	app.post('/water',function(req,resp){
		//console.log(req);
		var data={};
		data.deviceId=req.query.d;
		data.level=req.query.l;
		console.log("water data ",data)
		water.addWaterLevel(req,resp,data);
	});

	app.get('/motor/:id',function(req,resp){		
		console.log(1);
		var deviceId = req.params.id;
		console.log("device id",deviceId);
		water.getMotorStatus(req,resp,deviceId);
	});

	app.post('/motor',function(req,resp){
		var data={};
		data.deviceId=req.query.d;
		data.status=req.query.s;
		console.log("mototdata ",data);
		//console.log("Request 0000000000: ",req);
		water.addMotorStatus(req,resp,data);
	});
}

