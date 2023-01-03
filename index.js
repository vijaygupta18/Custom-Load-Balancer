const express = require('express')
const app = express()
const axios = require('axios');
const serverList=require('./serverList')

let currentServerIndex = 0, currentServer;

const handler = async (req, res) => {
  currentServer = serverList[currentServerIndex];
  currentServerIndex === (serverList.length - 1) ? currentServerIndex = 0 : currentServerIndex++;
  try {
    const response = await axios.get(currentServer);
    console.log(`successful proxy to the ${currentServer}`);
    res.send(response.data);
  }
  catch (err) {
    console.log(`failed proxy to  the -> ${currentServer}`);
    handler(req, res);
  }
}

app.use((req, res) => {
  handler(req, res);
})

app.listen(80, function (err) {
  if (err) console.log("Error in server setup");
  console.log("Server listening on Port", 80);
})

