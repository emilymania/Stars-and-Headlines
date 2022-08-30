const http = require('http');
const https = require('https');
const fs = require('fs');
const URL = require('url')
const path = require('path');

const port = 3000

let NASA = require('./NASA_req.js');
let NYTimes = require('./NYTimes_req.js');

let date = new Date();
let valid ="";

const requestHandler = function(request, response){
	console.log(request.url);
	if (request.url.startsWith('favicon', 1)) {
  		response.writeHead(404)
  		response.end()
  	}
  	if (request.url.startsWith('/images/')) {
		const imgPath = path.join(__dirname, request.url);
		console.log(imgPath);
  		const image_stream = fs.createReadStream(imgPath, 'utf-8');
  		response.writeHead(200, {'content-type': 'image/jpeg' });
      	image_stream.pipe(response);
    	image_stream.on('error', function (err) {
      		console.log(err);
    		response.writeHead(404);
    		response.end();
    	});
  	}
  	if (request.url.startsWith('/date')) {
 		const q = URL.parse(request.url, true).query.Date;
 		console.log(q);
 		user_input = q;
 		if(validate_data(user_input, response)=== true){
 			NASA.NasaReq(user_input, response);
 		}else{	
  		response.writeHead(200, { 'content-type': 'text/html' });
  		fs.createReadStream('./HTML/HOME_PAGE.html', 'utf-8').pipe(response);
 		}
  	}
  	if (request.url === '/') {
  		const stream = fs.createReadStream('./HTML/HOME_PAGE.html', 'utf-8')
  		response.writeHead(200, { 'content-type': 'text/html' });
  		stream.pipe(response);
  }
}
const server = http.createServer(requestHandler)
const validate_data = function(data, response){
	let year = data.substring(0,4);
	let month = data.substring(5,7);
	let day = data.substring(8,10);

	let lower = new Date(1995, 6, 25);
	let current = new Date(year-1, month, day);
	
	if(current > lower && current < date){
		return true;
	}
	else return false;
}
server.listen(port, (err) => {
  if (err) {
    throw err;
  }
  console.log(`server is listening on ${port}`)
})

