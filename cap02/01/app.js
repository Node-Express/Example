let http = require('http');

http.createServer(function(req,res){
//	res.writeHead(200,{'Content-Type':'text/plain'});
//	res.end('Hello Word');
	res.writeHead(200,{'Content-Type':'text/html'});
	res.end('<html><body><span>Hello Word</span></body></html>');
	
}).listen(3000);

console.log('Server started on localhost:3000; press Ctrl-C to terminate....');
