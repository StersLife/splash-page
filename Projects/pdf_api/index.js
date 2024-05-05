const express = require('express');
const handlePuppteer = require('./puppeteer');
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const port = 9000;

app.use(bodyParser.json());
app.use(cors());

app.post('/puppeteer/pdf', handlePuppteer);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});