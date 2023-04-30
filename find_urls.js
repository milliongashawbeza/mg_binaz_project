const fs = require("fs");
fs.readFile("output.json", function (err, data) {
    // If there is any error this line will execute
    if (err) throw err;
    // Here we are converting the data to Javascript object
    const file = JSON.parse(data);
    // Here we are printing the data.  
   
    console.log(file[0].url)
    console.log(file.length)
   // console.log(file[0]['url']);
}); 

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