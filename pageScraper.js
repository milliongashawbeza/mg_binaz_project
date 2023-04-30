var stringify = require('json-stringify');
const fs = require('fs'); 
//const json = require('./output.json') 
const Excel = require('exceljs')



const scraperObject = {
    url: 'https://bina.az/items/3408770',
    async scraper(browser){
        let page = await browser.newPage();
		console.log(`Navigating to ${this.url}...`); 
		fs.readFile("urls.json", async function (err, data) {
			// If there is any error this line will execute
			if (err) throw err;
			// Here we are converting the data to Javascript object
			const file = JSON.parse(data);
			// Here we are printing the data. 
			console.log(file.length)
			console.log(file[0]['url']); 
			for(i=0;i<file.length;i++){ 
				var ad_url= 'https://bina.az'+file[i].url;
				await page.goto(ad_url);
		// Wait for the required DOM to be rendered  
		await page.waitForSelector('.phone-container')
		await page.click('.phone-container');
		
		//Get Element Text 
		await page.waitForSelector('.js-phones')
		let phone_number = await page.$('.js-phones')   
		let value = await page.evaluate(el => el.textContent, phone_number) 
		console.log(value)
		//address 
		let address = await page.$('.map_address')
	
		let data_lat= await page.evaluate(() => 
		Array.from(document.querySelectorAll("#item_map")).map(d => d.getAttribute("data-lat"))
	 	 ) 
	 	 let data_long= await page.evaluate(() => 
		Array.from(document.querySelectorAll("#item_map")).map(d => d.getAttribute("data-lng"))
	  	)
		let address_value = await page.evaluate(el => el.textContent, address)  
		//console.log("Adress value is : "+address_value);
		//console.log("Lat : "+data_lat);
		//console.log("Long : "+data_long)
		//parameters 
		
	 

	
		  var parameters = await page.$$eval('.parameters tr', rows => {
			return Array.from(rows, row => {
			  const columns = row.querySelectorAll('td');
			  return Array.from(columns, column => column.innerText);
			});
		  });  

		
		
		  //console.log(parameters)
		  //Ad price and details 
		  let title_elem = await page.$('.services-container>h1');
		  let price_elem = await page.$('.price-val')
		  let currency_elem = await page.$('.price-cur')
			let type_elem = await page.$('.detail>h3') 
		  let unit_price_elem = await page.$('.price-val');
		  let price_value = await page.evaluate(el => el.textContent, price_elem)   
		  let curr_value = await page.evaluate(el => el.textContent, currency_elem)  
		  let type_value = await page.evaluate(el => el.textContent, type_elem) 
	
		  var price_rent_value='';
		  var price_curr_rent_value = '';
		  var price_per_value= '';
		  if(type_value=="Kirayə")  {
			let unit_price__rent_elem = await page.$('.price-val');
			let price_curr_elem = await page.$('.price-cur');
			let price_per_elem = await page.$('.price-per'); 

			 price_rent_value = await page.evaluate(el => el.textContent, unit_price__rent_elem)  
			 price_curr_rent_value = await page.evaluate(el => el.textContent, price_curr_elem) 
			 price_per_value= await page.evaluate(el => el.textContent,price_per_elem) 
		  }else {
			unit_price_value = await page.evaluate(el=>el.textContent,unit_price_elem); 
		  }
		
		 let title_value = await page.evaluate(el=>el.textContent,title_elem);
		 const imgs = await page.$$eval('.photos img[src]', imgs => imgs.map(img => img.getAttribute('src')));
		var imgstringfy = stringify(imgs);
		 //console.log("Price value"+price_value);
		//console.log("Curr value"+curr_value); 
		//console.log("Unit price "+unit_price_value); 
		//console.log("title value "+title_value)
		//console.log("Images")
		//console.log(imgs)
		//contact 
		let name_elem = await page.$('.contacts>.name')  
		let owner_elem = await page.$('.ownership')
		await page.waitForSelector('.js-phones li')
		let phone_no_elem = await page.$('.js-phones li') 
		let name_value = await page.evaluate(el => el.textContent, name_elem) 
		let owner_value = await page.evaluate(el => el.textContent, owner_elem)  
		let phone_no_value = await page.evaluate(el => el.textContent, phone_no_elem)  
		//console.log("name value : "+name_value)
		//console.log("owner value : "+owner_value)
		//console.log("phone no value : "+phone_no_value)
		//item_info
		
		let info_elem = await page.$('.item_info') 
		let info_value = await page.evaluate(el => el.textContent, info_elem) 
		let article_element = await page.$('article') 
		var article_value = await page.evaluate(el=>el.textContent,article_element) 
		var info = info_value.split(":") 
		var ad_number ;
		var view ;
		var update;  
	
		if(info.length==5){
			ad_number = Number(info[1].replace(/[^0-9]/g, ''))
			view = Number(info[2].replace(/[^0-9]/g, ''))
			update = info[3].replace(/[^0-9]/g, '')+':'+info[4].replace(/[^0-9]/g, '')
		} else{
			ad_number = Number(info[1].replace(/[^0-9]/g, ''))
			view = Number(info[2].replace(/[^0-9]/g, ''))
			update = info[3].split('Yeniləndi:').pop()
		}
		//console.log("ad number :"+ad_number) 
		//console.log("view :"+view)
		//console.log("update "+update)
		//console.log("article"+article)  	
		var data;
		if(type_value=="Kirayə")  {
			if(parameters.length==4){
				data = 	'{ "url":"'+ad_url+'","title":"'+title_value+'","type":"'+type_value+'","price":"'+price_value+'","price_currency":"'+curr_value+'" ,"price_rent_value":"'+price_rent_value+'","price_curr_rent_value":"'+price_curr_rent_value+'","price_per_value":"'+price_per_value+'"'+
		',"address":"'+address_value+'","lat":'+data_lat+',"lng":'+data_long+''+
		',"Kateqoriya":"'+parameters[0][1]+'","Mərtəbə":"'+parameters[1][1]+'","Sahə":"'+parameters[2][1]+'","Otaq sayı":"'+parameters[3][1]+'","Təmir":""'+
		',"name":"'+name_value+'","owner":"'+owner_value+'","phone_no":"'+phone_no_value+'"'+
		',"ad_number":'+ad_number+',"view":'+view+',"update":"'+update+'"'+
		'}'; 
			}else{
				data = 	'{ "url":"'+ad_url+'","title":"'+title_value+'","type":"'+type_value+'","price":"'+price_value+'","price_currency":"'+curr_value+'" ,"price_rent_value":"'+price_rent_value+'","price_curr_rent_value":"'+price_curr_rent_value+'","price_per_value":"'+price_per_value+'"'+
		',"address":"'+address_value+'","lat":'+data_lat+',"lng":'+data_long+''+
		',"Kateqoriya":"'+parameters[0][1]+'","Mərtəbə":"'+parameters[1][1]+'","Sahə":"'+parameters[2][1]+'","Otaq sayı":"'+parameters[3][1]+'","Təmir":"'+parameters[4][1]+'"'+
		',"name":"'+name_value+'","owner":"'+owner_value+'","phone_no":"'+phone_no_value+'"'+
		',"ad_number":'+ad_number+',"view":'+view+',"update":"'+update+'"'+
		'}'; 
			}
			
		  }else { 
			if(parameters.length==5){
				data = 	'{ "url":"'+ad_url+'","title":"'+title_value+'","type":"'+type_value+'","price":"'+price_value+'","price_currency":"'+curr_value+'" ,"price_rent_value":"'+price_rent_value+'","price_curr_rent_value":"'+price_curr_rent_value+'","price_per_value":"'+price_per_value+'"'+
		',"address":"'+address_value+'","lat":'+data_lat+',"lng":'+data_long+''+
		',"Kateqoriya":"'+parameters[0][1]+'","Sahə":"'+parameters[1][1]+'","Torpaq sahəsi":"'+parameters[2][1]+'","Otaq sayı":"'+parameters[3][1]+'","Çıxarış":"'+parameters[4][1]+'"'+
		',"name":"'+name_value+'","owner":"'+owner_value+'","phone_no":"'+phone_no_value+'"'+
		',"ad_number":'+ad_number+',"view":'+view+',"update":"'+update+'"'+
		'}'; 
			}else{
				data = 	'{ "url":"'+ad_url+'","title":"'+title_value+'","type":"'+type_value+'","price":"'+price_value+'","price_currency":"'+curr_value+'" ,"price_rent_value":"'+price_rent_value+'","price_curr_rent_value":"'+price_curr_rent_value+'","price_per_value":"'+price_per_value+'"'+
		',"address":"'+address_value+'","lat":'+data_lat+',"lng":'+data_long+''+
		',"Kateqoriya":"'+parameters[0][1]+'","Mərtəbə":"'+parameters[1][1]+'","Sahə":"'+parameters[2][1]+'","Otaq sayı":"'+parameters[3][1]+'","Çıxarış":"'+parameters[4][1]+'","Təmir":"'+parameters[5][1]+'"'+
		',"name":"'+name_value+'","owner":"'+owner_value+'","phone_no":"'+phone_no_value+'"'+
		',"ad_number":'+ad_number+',"view":'+view+',"update":"'+update+'"'+
		'}'; 
			}
			
		  }
	 
	
		//console.log(stringify(data));
		var p = stringify(data) 
		console.log(JSON.parse(p)) 
		var parsed = JSON.parse(data) 
		var json = fs.readFileSync('output.json');
		var myObject= JSON.parse(json);
		myObject.push(parsed)  
		var newData = JSON.stringify(myObject);
		fs.writeFile('output.json', newData, (err) => {
			if (err) reject(err)
			console.log("File saved.")
		})
			}
		}); 
		// Navigate to the selected page
		
		
		
		//fs.writeFile("output.json", p, 'utf8', function (err) {
		//	if (err) {
		//		console.log("An error occured while writing JSON Object to File.");
		//		return console.log(err);
		//	}
		 
		//	console.log("JSON file has been saved.");
		//});
    }

}

module.exports = scraperObject;