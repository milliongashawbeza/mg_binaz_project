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
const browserObject = require('./browser');
const scraperController = require('./pageController');

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
app.get('/filterByAdOwnership/:tyoe',(req,res)=>{
	res.send("filtering by ownership type ")
	
})
//Filter by purchase type purchase or Rend  

app.get('/filterByPurchase/:type',(req,res)=>{
	res.send("filtering by purchase type ")
}) ; 
////Filter by purchase building type or Apartment | new building |old building |Garder | office 
app.get('/filterByBuildingtype',(req,res)=>{
	res.send("filtering by building type ")
})
//Filter by number of room || 1 bed room | 2 bed room | 3 bed room 
app.get('/filterByNumberOfRoom',(req,res)=>{
	res.send("filtering by bed room  ")
}) 
// Filter by price min - max 
app.get('/filterByPrice/:min/:max',(req,res)=>{
	res.send("filtering by price Min and max   ")
}) 
// Filter by location Sheki | shamkir 
app.get('/filterByLocation/:location',(req,res)=>{
	res.send("filtering by location   ")
})
// Advanced search 
app.get('/advancedSearch/:type',(req,res)=>{
	res.send("filtering by location   ")
})

app.get('/fetch_urls',(req,res)=>{ 
    //Fetch urls 
    //and put all urls to urls file 
   upwork_project_ads.fetchTitles().then((titles) => console.log(titles));
    res.send(" Fetching Url"); 
})
 
app.listen(PORT, function(err){
    if (err) console.log("Error in server setup")
    console.log("Server listening on Port", PORT);
})

