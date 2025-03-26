// where your node app starts
// server.js

const compression = require("compression");
const cors = require("cors");
const express = require("express");
const fetch = require("node-fetch");

const app = express();

// compress our client side content before sending it over the wire
app.use(compression());

// your manifest must have appropriate CORS headers, you could also use '*'
app.use(cors({ origin: "https://trello.com" }));

// http://expressjs.com/en/starter/static-files.html
app.use(express.static("js"));
app.use(express.static("public"));

const downloadPathRe =
  /^\/1\/cards\/[0-9a-f]{24}\/attachments\/[0-9a-f]{24}\/download\/.+/;
const apiHost = "https://api.trello.com";

app.get(downloadPathRe, (req, res) => {
  fetch(`${apiHost}${req.path}`, {
    headers: {
      Authorization: `OAuth oauth_consumer_key="${req.query.key}", oauth_token="${req.query.token}"`,
    },
  }).then((r) => r.body.pipe(res.status(r.status)));
});

// listen for requests :)
const listener = app.listen(process.env.PORT, function () {
  console.info(`Node Version: ${process.version}`);
  console.log(
    "Trello Power-Up Server listening on port " + listener.address().port
  );
});
