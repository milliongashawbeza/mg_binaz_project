const axios = require("axios");
const cheerio = require("cheerio"); 
const { info } = require("console");
const internal = require("stream");
var pageNo = 1;  
const Excel = require('exceljs')
var stringify = require('json-stringify');
const fs = require('fs')
const generateXLSX = async(data) => {   	
    let workbook = new Excel.Workbook()
    let worksheet = workbook.addWorksheet('Debtors') 
       // row.getCell(1).value = inputData.job-link;
       // row.getCell(2).value = inputData.job-title;
       // row.getCell(3).value = inputData.company-name;
       // row.getCell(4).value = inputData.company-location; 
       // row.getCell(5).value = inputData.company-rating; 
       // row.getCell(6).value = inputData.job-snippet; 
       //row.getCell(7).value = inputData.job-salary; 
        // row.getCell(8).value = inputData.post-date; 
    worksheet.columns = [
        {header: 'link', key: 'link'},
        {header: 'name', key: 'name'},
        {header: 'email', key: 'email'},
        {header: 'phone-number', key: 'phone-number'},
        {header: 'id', key: 'id'},
        {header: 'view', key: 'view'} ,
        {header: 'update_data', key: 'update_date'}, 
      
      ]   

      worksheet.columns.forEach(column => {
        column.width = column.header.length < 12 ? 12 : column.header.length
      }) 

      worksheet.getRow(1).font = {bold: true} 

      data.forEach((e, index) => {
        // row 1 is the header.
        const rowIndex = index + 2
      
        // By using destructuring we can easily dump all of the data into the row without doing much
        // We can add formulas pretty easily by providing the formula property.
        worksheet.addRow({
          ...e,
          amountRemaining: {
            formula: `=C${rowIndex}-D${rowIndex}`
          },
          percentRemaining: {
            formula: `=E${rowIndex}/C${rowIndex}`
          }
        })
      })

      data.forEach((e, index) => {
        // row 1 is the header.
        const rowIndex = index + 2
      
        // By using destructuring we can easily dump all of the data into the row without doing much
        // We can add formulas pretty easily by providing the formula property.
        worksheet.addRow({
          ...e,
          amountRemaining: {
            formula: `=C${rowIndex}-D${rowIndex}`
          },
          percentRemaining: {
            formula: `=E${rowIndex}/C${rowIndex}`
          }
        })
      })

      worksheet.views = [
        { state: 'frozen', xSplit: 0, ySplit: 1, activeCell: 'B2' }
      ] 

      // Keep in mind that reading and writing is promise based.
	workbook.xlsx.writeFile('bin.xlsx') 
	workbook.xlsx.readFile('bina.xlsx')
    .then(function() {
        var worksheet = workbook.getWorksheet(1);
        var row = worksheet.getRow(5);
        row.getCell(1).value = 5; // A5's value set to 5
        row.commit();
        return workbook.xlsx.writeFile('new.xlsx');
    })

};
const get_ads = async(id)=>{
    try {
		var u= 'https://bina.az'+id;
		console.log(u)
		const response = await axios.get(u);

        const html = response.data;

		const $ = cheerio.load(html);

		const titles = []; 
		const o = []
		const name=  $('.contacts>.name');
		const owner = $('.ownership');   
		const ad_info = $('.item_info').text(); 
		const email = $('.email a').attr('href');    
		const address= $('.map_address').text(); 
		var parametrs = $('.parameters').text();
		var description = $('article').text(); 
		var title = $('.parameters>h1').text(); 
		var unit_price = $('.unit-price').text();
		var price_value = $('.price-val').text();
		var price_cur = $('price-cur').text();
		var info = ad_info.split(":") 
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
	
		const phone_number = $('.js-phones').text()
		if(owner.text()=='vasitəçi (agent)'){
			
		}else{ 
			console.log("###################################"+ad_info+"##########"+info.length)
		
			o.push(u)
			o.push(owner.text())
			o.push(name.text()) 
			o.push(ad_number) 
			o.push(view)
			o.push(update)
			o.push(email)  
			o.push(phone_number)   
		
			var d = [{
				'link':u,
				'name':name,
				'email':email,
				'phone-number':phone_number,
				'id':ad_number,
				'view':view,
				'update_date':update
			}];
			generateXLSX(o);
		}
	
		console.log(o)
	

		return o;
	} catch (error) {
		throw error;
	}
} 

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

module.exports = { fetchTitles };

