//  OpenShift sample Node application
var express = require('express'),
    app     = express();
var route = require('./routes/route');
var dbConfig = require('./core/db');
var db = dbConfig.dbs;
//var initDb = db.initDb;
//Object.assign=require('object-assign')
var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
    ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';





app.get('/',function(req,resp){
		resp.send("hello");
	resp.end();
		
});
app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500).send('Something bad happened!');
});


app.listen(port, ip);
console.log('Server running on http://%s:%s', ip, port);


route.serve(app,express);
module.exports = app ;
  
