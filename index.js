const express = require('express')
const app = express()
const axios = require('axios');
const servers = require('./serverList')

let currentServerIndex = 0, currentServer;
let serverList = servers;
let allServers = servers;
app.listen(80, function (err) {
  if (err) console.log("Error in server setup");
  console.log("Server listening on Port", 80);
  setInterval(() => {
    healthCheckCurrentServer();
    healthCheckDownServers();
  }, 10000);
})

const handler = async (req, res) => {
  if (serverList.length) {
    currentServer = serverList[currentServerIndex];
    currentServerIndex++;
    currentServerIndex = currentServerIndex % (serverList.length);
    try {
      const response = await axios.get(currentServer);
      console.log('running', currentServer);
      res.send(response.data);
    }
    catch (err) {
      console.log(`server ${currentServer} failed running ${serverList[currentServerIndex]}`);
      handler(req, res);
    }
  }
  else {
    res.send('No servers available');
  }
}

const healthCheckDownServers = async () => {
  for (server of allServers) {
    if (!serverList.includes(server)) {
      try {
        const response = await axios.get(currentServer);
        if (response.data) {
          console.log(`adding server ${server} back in serverList`);
          serverList.push(server);
        }
      } catch (e) { }
    }
  }
}
const healthCheckCurrentServer = async () => {
  console.log(serverList);
  if (currentServer) {
    try {
      console.log('Running health check for', currentServer);
      const response = await axios.get(currentServer);
      if (response) {
        console.log(`server ${currentServer} is healthy`);
      }
    }
    catch (e) {
      serverList = serverList.filter(function (itm) {
        return itm !== currentServer;
      })
      console.log(`health of server ${currentServer} failed }`);
    }

  }
}
app.use((req, res) => {
  handler(req, res);
})


