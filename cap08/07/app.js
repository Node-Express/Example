let express = require('express');

let cookie = require('cookie-parser');

let formidable = require('formidable');

let app = express();

let handlebars = require('express3-handlebars').create({
	defaultLayout: 'main',
	helpers: {
		section: function(name,options){
			try{
				if(!this._sections) this._sections = {};
				this._sections[name] = options.fn(this);
				return null;
			}
			catch(ex){
				console.log(ex);
			}
			
		}
	}
});

app.engine('handlebars',handlebars.engine);
app.set('view engine','handlebars');

app.set('port',process.env.PORT || 3000);

app.use(express.static(__dirname + '/public'));

app.use(require('body-parser')());
app.use(function(req,res,next){
	res.locals.showTests = app.get('env') !== 'production' && req.query.test === '1';
	next();
});

app.use(function(req,res,next){
	if(!res.locals.partials){
		res.locals.partials = [];
	}
	res.locals.partials.weather = {};
	next();
});

app.get('/thank-you', function(req, res){
	res.render('thank-you');
});

app.get('/', function(req, res){
	// 我们会在后面学到CSRF……目前，只提供一个虚拟值
	res.render('newsletter', { csrf: 'CSRF token goes here' });
});
app.get('/newsletter', function(req, res){
	// 我们会在后面学到CSRF……目前，只提供一个虚拟值
	res.render('newsletter', { csrf: 'CSRF token goes here' });
});

app.get('/contest/vacation-photo',function(req,res){
	var now = new Date();
		res.render('contest/vacation-photo',{
		year: now.getFullYear(),month: now.getMonth()
	});
});

app.post('/contest/vacation-photo/:year/:month', function(req, res){
	var form = new formidable.IncomingForm();
	form.parse(req, function(err, fields, files){
		if(err) return res.redirect(303, '/error');
		console.log('received fields:');
		console.log(fields);
		console.log('received files:');
		console.log(files);
		res.redirect(303, '/thank-you');
	});
});

app.post('/process', function(req, res){
	console.log('Form (from querystring): ' + req.query.form);
	console.log('CSRF token (from hidden form field): ' + req.body._csrf);
	console.log('Name (from visible form field): ' + req.body.name);
	console.log('Email (from visible form field): ' + req.body.email);
	res.redirect(301, '/thank-you');
});

app.use(function(req,res){
	res.status(404);
	res.render('404');
});

app.use(function(err,req,res,next){
	console.error(err.stack);
	res.status(500);res.render('500');
});

app.listen(app.get('port'),function(){
	console.log('Express started on http://localhost:' + app.get('port') + ';press Ctrl-C to terminat.')
});