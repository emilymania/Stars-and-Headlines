const https = require('https');
const fs = require('fs');
	const querystring = require('querystring');

	let NYTimes_key = require('./API-KEY/NYTimes_APIKey.json');


	let NYTimes_endpoint = 'https://api.nytimes.com/svc/archive/v1/'

	let headlines = [];
	let date = new Date();
	let NYTimes_req = function(year, month, response){
		console.log(date + ' : calling NYTimes Request');
		let uri = `${year}/${month}.json?`
		let q = querystring.stringify({
			'api-key' : NYTimes_key.key
		});
  		let body = "";
		let headline_req = https.get(`${NYTimes_endpoint}${uri}${q}`, function (headline_response){
			headline_response.on('data', function(chunk){
				body += chunk;
			});
			headline_response.on('end', function(){
				let data = JSON.parse(body);
				for(let i = 0; i< 31; i++){
					console.log(data.response.docs[i].headline.main);
					headlines.push('<div class="grid-item">');
					headlines.push(data.response.docs[i].headline.main);
					headlines.push('</div>');
				}
				headlines.push('</body>');
				headlines.push('</html>');
				fs.appendFileSync('./HTML/OutputWebpage.html', headlines.join(''), function(err){
					if(err){
						throw err;
					}else{}
				});
				headlines = [];
				let stream = fs.createReadStream('./HTML/OutputWebpage.html', 'utf-8');
				response.writeHead(200, { 'content-type': 'text/html' });						
  				stream.pipe(response);
			});
		});
		headline_req.end();
	}
	module.exports.NYTimesReq = NYTimes_req;