﻿let express = require('express');
let fortune = require('./lib/fortune.js');
let product = require('./lib/product.js');
let weather = require('./lib/weather.js');

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

app.use(function(req,res,next){
	res.locals.showTests = app.get('env') !== 'production' && req.query.test === '1';
	next();
});

app.use(function(req,res,next){
	if(!res.locals.partials){
		res.locals.partials = [];
	}
	res.locals.partials.weather = weather.getWeather();
	next();
});


app.get('/',function(req,res){
	res.render('home',product.getProducts());
});
app.get('/about',function(req,res){
	res.render('about',{
		fortune: fortune.getFortune(),
		pageTestScript: '/qa/tests-about.js'
	});
});
app.get('/jqtest',function(req,res){
	res.render('jqtest',{});
});
app.get('/nursery-rhyme',function(req,res){
	res.render('nursery-rhyme',{});
});

app.get('/data/nursery-rhyme', function(req, res){
	res.json({
		animal: 'squirrel',
		bodyPart: 'tail',
		adjective: 'bushy',
		noun: 'heck',
	});
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