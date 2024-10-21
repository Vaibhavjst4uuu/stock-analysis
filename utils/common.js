const csv = require('csv-parser');
const moment = require('moment');
const fs = require("fs")

// Function to parse CSV files


function parseCSV(filePath) {
    return new Promise((resolve, reject) => {
        const results = [];
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (data) => {
                // Create a new object with trimmed keys
                const trimmedData = {};
                for (let key in data) {
                    const trimmedKey = key.trim(); // Remove any leading/trailing spaces
                    trimmedData[trimmedKey] = data[key];
                }
                results.push(trimmedData);
            })
            .on('end', () => resolve(results))
            .on('error', (error) => reject(error));
    });
}



function getDays(date) {     
    date = date.toUpperCase();
    return moment(date, 'DD-MMM-YYYY', true).format('dddd');
}


module.exports = {
    parseCSV, getDays
}