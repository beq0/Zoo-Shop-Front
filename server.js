const path = require("path");
const express = require("express");
const app = require("./public/App.js");

const server = express();

server.use(express.static(path.join(__dirname, "public")));

server.get("*", function(req, res) {
  const { html } = app.render({ url: req.url });

  res.write(`
    <!DOCTYPE html>

    <meta charset='utf-8'>
    
    <script src="/xlsx.full.min.js"></script>
    <meta name="viewport" content="user-scalable=no, width=device-width, initial-scale=1, maximum-scale=1">
    <link rel="icon" href="images/favicon.png" sizes="16x16" type="image/png">
    <title>ზოო-მაღაზია</title>

    <link rel='stylesheet' href='/global.css'>
    <link rel='stylesheet' href='/bundle.css'>

    <script src="/materialize.min.js"></script>

    
    <link rel="stylesheet" href="/bootstrap.min.css"
          integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">

    <div id="app">${html}</div>
    <script src="/bundle.js"></script>
  `);

  res.end();
});

const port = 4200;
server.listen(port, () => console.log(`Listening on port ${port}`));
