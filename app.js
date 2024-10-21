const express = require("express")
const app = express();
const port = process.env.port || 8000;

const axios = require('axios');
const fileUpload = require("express-fileupload");
const path = require("path")

const { FileUpload } = require("./utils/uploadFiles");
const { parseCSV, getDays } = require("./utils/common");

const API_KEY = 'KNRVAHY1N1V3KXR8';
const symbol = 'RELIANCE.BSE'; // Example Indian stock symbol

app.use(fileUpload());
app.use(express.json());
app.use(express.static(path.join(__dirname, "./")));

const getStockData = async () => {
    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${API_KEY}`;

    try {
        const response = await axios.get(url);
        const data = response.data['Time Series (Daily)'];
        // console.log(data); // Logs daily stock data with highs/lows
        return data;
    } catch (error) {
        console.error('Error fetching stock data', error);
    }
};

getStockData();

app.get("/", async (req, res) => {
    const data = await getStockData();
    console.log(data);
    res.status(200).json(data)
})


app.post("/json", async (req, res) => {
    const file = await FileUpload(req.files.file, "user/");
    const filePath = file.file_path;
    const data = await parseCSV(filePath);

    data.map((val) => {
        const open = val["Open"];
        const high = val["High"];
        const low = val["Low"];

        const percentHigh = ((high - open) / open) * 100;
        const percentLow = ((low - open) / open) * 100;
        val.day = getDays(val["Date"]);
        val.percentHigh = `${percentHigh.toFixed(2)}%`;
        val.percentLow = `${percentLow.toFixed(2)}%`;
        return val;
    })

    res.status(200).json(data);
})



app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})

