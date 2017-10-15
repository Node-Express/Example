﻿let express = require('express');
let fortune = require('./lib/fortune.js');

let app = express();


let mock = {
	currency: {
		name: 'United States dollars', abbrev: 'USD'
	},
	tours: [{
		name: 'Hood River', price: '$99.95'
	},{
		name: 'Oregon Coast', price: '$159.95'
	}],
	specialsUrl: '/january-specials',
	currencies: ['USD', 'GBP', 'BTC']
};



let handlebars = require('express3-handlebars').create({defaultLayout: 'main'});

app.engine('handlebars',handlebars.engine);
app.set('view engine','handlebars');

app.set('port',process.env.PORT || 3000);

app.use(express.static(__dirname + '/public'));

app.use(function(req,res,next){
	res.locals.showTests = app.get('env') !== 'production' && req.query.test === '1';
	next();
});


app.get('/',function(req,res){
	res.render('home',mock);
});
app.get('/about',function(req,res){
	res.render('about',{
		fortune: fortune.getFortune(),
		pageTestScript: '/qa/tests-about.js'
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