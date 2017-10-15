/*jshint esversion: 6 */

let express = require('express');
let fortune = require('./lib/fortune.js');

let app = express();


let handlebars = require('express3-handlebars').create({defaultLayout: 'main'});

app.engine('handlebars',handlebars.engine);
app.set('view engine','handlebars');

app.set('port',process.env.PORT || 3000);

app.use(express.static(__dirname + '/public'));

app.use(function(req,res,next){
	res.locals.showTests = app.get('env') !== 'production' && req.query.test === '1';
	next();
});

app.get('/file/:name', function (req, res, next) {
	console.log(req.ip);
	
	let mFile = req.params.name,
		mFullPath = __dirname + '/public/' + mFile;
		
	res.download(mFullPath, mFile, function(err){
	  if (err) {
		  console.log(err);
		// Handle error, but keep in mind the response may be partially-sent
		// so check res.headersSent
	  } else {
		// decrement a download credit, etc.
	  }
	});
});

app.get('/file/:name', function (req, res, next) {

  var options = {
    root: __dirname + '/public/',
    dotfiles: 'deny',
    headers: {
        'x-timestamp': Date.now(),
        'x-sent': true
    }
  };

  var fileName = req.params.name;
  res.sendFile(fileName, options, function (err) {
    if (err) {
      console.log(err);
      res.status(err.status).end();
    }
    else {
      console.log('Sent:', fileName);
    }
  });
});

app.get('/',function(req,res){
	res.render('home');
});
app.get('/about',function(req,res){
	res.render('about',{
		fortune: fortune.getFortune(),
		pageTestScript: '/qa/tests-about.js'
	});
});

app.get('/tours/hood-river',function(req,res){
	res.render('tours/hood-river');
});
app.get('/tours/request-group-rate',function(req,res){
	res.render('tours/request-group-rate');
});
/*
app.get('/tours/oregon-coast',function(req,res){
	res.render('tours/oregon-coast');
});
*/

app.use(function(req,res){
	res.status(404);
	res.render('404');
});

app.use(function(err,req,res,next){
	console.error(err.stack);
	res.status(500);
	res.render('500');
});

app.listen(app.get('port'),function(){
	console.log('Express started on http://localhost:' + app.get('port') + ';press Ctrl-C to terminat.');
});