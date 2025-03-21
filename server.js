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
app.use(express.static("public"));

app.get(
  "/1/cards/:cardId/attachments/:attachmentId/download/:filename",
  (req, res) => {
    fetch(
      `https://api.trello.com/1/cards/${req.params.cardId}/attachments/${req.params.attachmentId}/download/${req.params.filename}`,
      {
        headers: {
          Authorization: `OAuth oauth_consumer_key="${req.query.key}", oauth_token="${req.query.token}"`,
        },
      }
    ).then((r) => r.body.pipe(res));
  }
);

// listen for requests :)
const listener = app.listen(process.env.PORT, function () {
  console.info(`Node Version: ${process.version}`);
  console.log(
    "Trello Power-Up Server listening on port " + listener.address().port
  );
});
