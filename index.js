const express = require('express')
var bodyParser = require('body-parser') 
const expressip = require('express-ip');
const app = express(); 
const axios = require("axios");
const cheerio = require("cheerio"); 
const { info } = require("console");
const internal = require("stream");
var pageNo = 1;  
const Excel = require('exceljs')
var stringify = require('json-stringify');
const fs = require('fs') 
var upwork_project_ads = require('./upwork_project_ads.js') 
//Pupeteer 
const browserObject = require('./browser.js');
const scraperController = require('./pageController.js');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(expressip().getIpInfoMiddleware);

app.use((req, res, next) => {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Request methods you wish to allow
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, OPTIONS, PUT, PATCH, DELETE'
  );

  // Request headers you wish to allow
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-Requested-With,content-type'
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});
const pagination = async(i)=>{
    try {
		const response = await axios.get('https://bina.az/items/all?page='+i);
		console.log("********** PAGE ***********"+i);
		const html = response.data;

		const $ = cheerio.load(html);

		const titles = [];  
		$('.items-i>.item_link').each((_idx, el) => { 
			// console.log()
			 const url = $(el).attr('href'); 
			 //Get product 
				  
		var d = {url};
	
		//console.log(stringify(data));
		var p = stringify(d) 
		console.log(JSON.parse(p)) 
		var parsed = JSON.parse(p) 
		var json = fs.readFileSync('urls.json');
		var myObject= JSON.parse(json);
		myObject.push(parsed)  
		var newData = JSON.stringify(myObject);
		fs.writeFile('urls.json', newData, (err) => {
			if (err) reject(err)
			console.log("url saved.")
		})
			 titles.push(url)
		 });
		 return titles;
	} catch (error) {
		throw error;
	}
}
const fetchTitles = async () => {
	try {
		const response = await axios.get('https://bina.az/items/all');

        const html = response.data;

		const $ = cheerio.load(html);

		const titles = []; 
		
		const items = $('.items-header--title').text(); 
		var total_ads = items.replace(/[^0-9]/g, '');
		var total_page = Number(total_ads)/24 
		total_page = Math.round(total_page);
	 
		for(i=1;i<10;i++){
		
			pagination(i)
		}

		

		//return titles;s
	} catch (error) {
		throw error;
	}
};
const PORT = 3000; 

app.get('/scrape_urls',(req,res)=>{
    //fetch url from urls.json and fetch and store data to output.json 
     //Start the browser and create a browser instance 
	 res.send("Scraping Urls, check Output.json"); 
	let browserInstance = browserObject.startBrowser();

	// Pass the browser instance to the scraper controller
	scraperController(browserInstance)

})

//Filter by ownership owner or Agent 
app.get('/filterByAdOwnership/:type',(req,res)=>{ 
	var type = req.params.type 
	//var type = "mülkiyyətçi"
	var a = [];
	var x = JSON.stringify(a); 
	fs.writeFileSync('filter_result.json', x, 'utf8');
	var filter_result = fs.readFileSync('filter_result.json');
	var myObject= JSON.parse(filter_result);
	fs.readFile("output.json", function (err, data) {
		// If there is any error this line will execute
		if (err) throw err;
		// Here we are converting the data to Javascript object
		const file = JSON.parse(data);
		// Here we are printing the data.  
		for(i=0;i<file.length;i++){
			if(file[i].owner==type){
				myObject.push(file[i])  
				var newData = JSON.stringify(myObject);
				//write it to filer_result.json
				fs.writeFile('filter_result.json', newData, (err) => {
				if (err) reject(err)
				console.log("File saved.")
				})
				console.log(file[i].url)
				console.log(file[i].title) 
				//res.send("filtering by ownership  "+file[i].url)
			}
		}
		
	   
	   // console.log(file[0]['url']);
	}); 
	res.send("filtering by ownership type check filter_result.json ")
	
})
//Filter by purchase type purchase or Rend  

app.get('/filterByPurchase/:type',(req,res)=>{ 
	var type = req.params.type 
	//var type = "Kirayə"
	var a = [];
	var x = JSON.stringify(a); 
	fs.writeFileSync('filter_result.json', x, 'utf8');
	var filter_result = fs.readFileSync('filter_result.json');
	var myObject= JSON.parse(filter_result);
	fs.readFile("output.json", function (err, data) {
		// If there is any error this line will execute
		if (err) throw err;
		// Here we are converting the data to Javascript object
		const file = JSON.parse(data);
		// Here we are printing the data.  
		for(i=0;i<file.length;i++){
			if(file[i].type==type){
				myObject.push(file[i])  
				var newData = JSON.stringify(myObject);
				//write it to filer_result.json
				fs.writeFile('filter_result.json', newData, (err) => {
				if (err) reject(err)
				console.log("File saved.")
				})
				console.log(file[i].url)
				console.log(file[i].title) 
				
			}
		}
		
	   
	   // console.log(file[0]['url']);
	}); 

	res.status(200).send("filtering by purchase type check filter_result.json")
}) ; 
////Filter by purchase building type or Apartment | new building |old building |Garder | office 
app.get('/filterByBuildingtype/:type',(req,res)=>{
	var type = req.params.type 
	//var type = "Köhnə tikili"
	//create an empty array
	var a = [];
	var x = JSON.stringify(a); 
	fs.writeFileSync('filter_result.json', x, 'utf8');
	var filter_result = fs.readFileSync('filter_result.json');
	var myObject= JSON.parse(filter_result);
	fs.readFile("output.json", function (err, data) {
		// If there is any error this line will execute
		if (err) throw err;
		// Here we are converting the data to Javascript object
		const file = JSON.parse(data);
		// Here we are printing the data.  
		for(i=0;i<file.length;i++){
			if(file[i].Kateqoriya==type){
				myObject.push(file[i])  
				var newData = JSON.stringify(myObject);
				//write it to filer_result.json
				fs.writeFile('filter_result.json', newData, (err) => {
				if (err) reject(err)
				console.log("File saved.")
				})
				console.log(file[i].url)
				console.log(file[i].title) 
				//res.send("filtering by category  "+file[i].url)
			}
		}
		
	   
	   // console.log(file[0]['url']);
	});  
	res.status(200).send("filtering by building type filter_result.json")
})
//Filter by number of room || 1 bed room | 2 bed room | 3 bed room 
app.get('/filterByNumberOfRoom/:number',(req,res)=>{
	var no_rooms = req.params.number 

fs.readFile("output.json", function (err, data) {
    // If there is any error this line will execute
    if (err) throw err;
    // Here we are converting the data to Javascript object
    const file = JSON.parse(data);
	//creating an empty arryay for filtered result 
	var a = [];
	var x = JSON.stringify(a); 
	fs.writeFileSync('filter_result.json', x, 'utf8');
	var filter_result = fs.readFileSync('filter_result.json');
	var myObject= JSON.parse(filter_result); 

    // Here we are printing the data.  
	for(i=0;i<file.length;i++){
		if(file[i].Otaq_sayı==no_rooms){ 
			
			myObject.push(file[i])  
		var newData = JSON.stringify(myObject);
			fs.writeFile('filter_result.json', newData, (err) => {
				if (err) reject(err)
				console.log("File saved.")
				})
			console.log(file[i].url)
			console.log(file[i].title) 
			
		}
	}
	
   // console.log(file[0]['url']);
}); 
res.status(200).send("filtering by bed room check filter_result.json")
}) 
// Filter by price min - max 
app.get('/filterByPrice/:min/:max',(req,res)=>{
	var min = req.params.min;
	var max = req.params.max;  
	//create an empty array
	var a = [];
	var x = JSON.stringify(a); 
	fs.writeFileSync('filter_result.json', x, 'utf8');
	var filter_result = fs.readFileSync('filter_result.json');
	var myObject= JSON.parse(filter_result);
	fs.readFile("output.json", function (err, data) {
		// If there is any error this line will execute
		if (err) throw err;
		// Here we are converting the data to Javascript object
		const file = JSON.parse(data);
		// Here we are printing the data.  
		for(i=0;i<file.length;i++){
			
			var price  = file[i].price.replace(/\s/g, '');
			
			var p =Number(price)
			console.log(file[i].price)
			console.log(p)
			if(p<max & p>min){ 
				//push ad to the object 
				myObject.push(file[i])  
				var newData = JSON.stringify(myObject);
				//write it to filer_result.json
				fs.writeFile('filter_result.json', newData, (err) => {
				if (err) reject(err)
				console.log("File saved.")
				})
				console.log(file[i].url)
				console.log(file[i].title) 
				
			}
		}
		
	   
	   // console.log(file[0]['url']);
	}); 
	res.status(200).send("filtering by min and max filter check filter_result.json")
}) 
// Filter by location Sheki | shamkir 
app.get('/filterByLocation/:location',(req,res)=>{
	var location = req.params.location;
	//create an empty array
	var a = [];
	var x = JSON.stringify(a); 
	fs.writeFileSync('filter_result.json', x, 'utf8');
	var filter_result = fs.readFileSync('filter_result.json');
	var myObject= JSON.parse(filter_result);
	fs.readFile("output.json", function (err, data) {
		// If there is any error this line will execute
		if (err) throw err;
		// Here we are converting the data to Javascript object
		const file = JSON.parse(data);
		// Here we are printing the data.  
		for(i=0;i<file.length;i++){
			if(file[i].address.match(location)){ 
				//push ad to the object 
				myObject.push(file[i])  
				var newData = JSON.stringify(myObject);
				//write it to filer_result.json
				fs.writeFile('filter_result.json', newData, (err) => {
				if (err) reject(err)
				console.log("File saved.")
				})
				console.log(file[i].url)
				console.log(file[i].title) 
			
			}
		}
		
	   
	   // console.log(file[0]['url']);
	});  
	res.status(200).send("filtering by location filter_result.json")
})
// Advanced search 
app.get('/advancedSearch/:type/:areaMin/:areaMax/:floorMin/:floorMax/:placement',(req,res)=>{ 
	var type = req.params.type;
	var areaMin = req.params.areaMin;
	var areaMax = req.params.areaMax;
	var floorMin = req.params.floorMin;
	var floorMax = req.params.floorMax;
	//create an empty array
	var a = [];
	var x = JSON.stringify(a); 
	fs.writeFileSync('filter_result.json', x, 'utf8');
	var filter_result = fs.readFileSync('filter_result.json');
	var myObject= JSON.parse(filter_result);
	fs.readFile("output.json", function (err, data) {
		// If there is any error this line will execute
		if (err) throw err;
		// Here we are converting the data to Javascript object
		const file = JSON.parse(data);
		// Here we are printing the data.  
		for(i=0;i<file.length;i++){ 
			var area = file[i].Sahə.match(/\d/g);
			var aNumber =Number(area) 
			if (type==all){
				if(aNumber<areaMax&aNumber>areaMin){ 
					//push ad to the object 
					myObject.push(file[i])  
					var newData = JSON.stringify(myObject);
					//write it to filer_result.json
					fs.writeFile('filter_result.json', newData, (err) => {
					if (err) reject(err)
					console.log("File saved.")
					})
					console.log(file[i].url)
					console.log(file[i].title) 
					res.send("filtering by location "+file[i].url)
				}
			}else{
				if(aNumber<areaMax&aNumber>areaMin&type==file[i].Təmir){ 
					//push ad to the object 
					myObject.push(file[i])  
					var newData = JSON.stringify(myObject);
					//write it to filer_result.json
					fs.writeFile('filter_result.json', newData, (err) => {
					if (err) reject(err)
					console.log("File saved.")
					})
					console.log(file[i].url)
					console.log(file[i].title) 
					res.send("filtering by location "+file[i].url)
				}
			}
			
		}
		
	   
	   // console.log(file[0]['url']);
	}); 
	res.status(200).send("advanced search check filter_result.json")
})

app.get('/fetch_urls',(req,res)=>{ 
    //Fetch urls 
    //and put all urls to urls file 
 	fetchTitles().then((titles) => console.log(titles));
    res.send(" Fetching Url"); 
})
 
app.listen(PORT, function(err){
    if (err) console.log("Error in server setup")
    console.log("Server listening on Port", PORT);
})

