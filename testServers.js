const express = require('express');
const app = express();
const PORT = process.env.PORT;

app.get('*', function (req, res) {
  console.log('requested from port', PORT);
  res.send(`Response from the PORT: ${PORT}`)
});

app.listen(PORT, function (err) {
  if (err) console.log("Error in server setup");
  console.log("Server listening on Port", PORT);
})