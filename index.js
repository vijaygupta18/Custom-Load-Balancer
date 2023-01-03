const express = require('express')
const app = express()
const axios = require('axios');
const serverList = require('./serverList')

let currentServerIndex = 0, currentServer;

app.listen(80, function (err) {
  if (err) console.log("Error in server setup");
  console.log("Server listening on Port", 80);
  setInterval(() => {
    healthCheckCurrentServer();
  }, 10000);
})

const handler = async (req, res) => {
  currentServer = serverList[currentServerIndex];
  currentServerIndex++;
  currentServerIndex = currentServerIndex % (serverList.length);
  try {
    const response = await axios.get(currentServer);
    console.log('running',currentServer);
    res.send(response.data);
  }
  catch (err) {
    console.log(`server ${currentServer} failed running ${serverList[currentServerIndex]}`);
    handler(req, res);
  }
}

const healthCheckCurrentServer = async () => {
  if (currentServer) {
    try {
      console.log('Running health check for', currentServer);
      const response = await axios.get(currentServer);
      if (response) {
        console.log(`server ${currentServer} is healthy`);
      }
    }
    catch (e) {
      console.log(`health of server ${currentServer} failed running ${serverList[currentServerIndex]}`);
    }

  }
}
app.use((req, res) => {
  handler(req, res);
})

