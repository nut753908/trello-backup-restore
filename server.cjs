/* global process */
const cors = require("cors");
const express = require("express");
const fs = require("fs");
const https = require("https");

const options = {
  key: fs.readFileSync(`${process.env.HOME}/.sslcert/domain.key`),
  cert: fs.readFileSync(`${process.env.HOME}/.sslcert/domain.crt`),
  passphrase: process.env.PASSPHRASE,
};
const app = express();
app.use(cors({ origin: "https://trello.com" }));
app.use(express.static("public"));
https.createServer(options, app).listen(8443);
