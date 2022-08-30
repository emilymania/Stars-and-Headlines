	const https = require('https');
	const querystring = require('querystring');
	const fs = require('fs');

	let NASA_key = require('./API-KEY/NASA_APIKey.json');

	let NASA_endpoint = 'https://api.nasa.gov/planetary/apod?'

	let NYTimes = require('./NYTimes_req.js');

	let painting = '';
	
	let img_path = './images/';

	let date = new Date();

	let year = "";		
	
	let month = "";

	const NASA_req = function(user_input, response){
		let year = user_input.substring(0,4)
		let month = user_input.substring(5,7);
		console.log(date + ' : calling NASA Request');
		let uri = querystring.stringify({
    		date : user_input,
    		hd : true,
    		api_key : NASA_key.key
  		});
  		let body = "";
  		console.log(`${NASA_endpoint}${uri}`);
		let data_req = https.get(`${NASA_endpoint}${uri}`, function (data_response) {
			data_response.on('data', function(chunk){
				body += chunk;
			});
			data_response.on('end', function(){
				let image = JSON.parse(body);
				if(image.hdurl != undefined){
					get_image(image.hdurl, response);

				}else{
					console.log("no image, only video.")
					let painting = '';
				}
			});
		});
		data_req.end();
		const get_image = function(data, response){
			let image_req = https.get(data, function(image_res){
				let n = data.lastIndexOf('/');
				let name = data.substring(n+1);
				let new_img = fs.createWriteStream(`${img_path}${name}`,{'encoding':null});
				image_res.pipe(new_img);
				new_img.on("finish", function(){
						generate_webpage(`../images/${name}`, response);
				});
			});
			image_req.on('error', function(err){
				console.log(err);
			});

		}
		const generate_webpage = function(image_data, response){
			console.log("image data : " + image_data);
			let map = ['<!DOCTYPE html>', '<html>', '<head>', '<h1>', 'NYTimes Headlines of : ', month,'/', year, '</h1>', '<style>{font-size: 36pt;color:salmon;}.grid-container {display: grid;}.grid-item {padding: 20px;font-size: 30px;text-align: center;}grid-item:hover{color:salmon;font-color:black;}body{ background-attachment: fixed;}</style>'];
			map.push('</head><body background =');
			map.push(image_data);
			map.push('>');
			map.push('<div class="grid-container">');
			let results = fs.writeFile('./HTML/OutputWebpage.html', map.join('') , function(err){
				if(err){
					console.log(err);
				}else{
					console.log(`${year}${month}`);
					NYTimes.NYTimesReq(year, month, response);
				}
			});
		}
	}



		module.exports.NasaReq = NASA_req;