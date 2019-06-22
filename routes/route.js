var bodyParser = require('body-parser');
var water = require('../controllers/water');
var db = require('../core/db');



exports.serve=function(app,express){

	app.use(bodyParser.json());
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
	})

	app.post('/water',function(req,resp){
		water.addWaterLevel(req,resp,req.body);
	});
}

