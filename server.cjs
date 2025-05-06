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
app.use(
  express.static("public", {
    setHeaders: function (res) {
      res.set(
        "Content-Security-Policy",
        "default-src 'none'; script-src 'self' https://p.trellocdn.com; style-src 'self' https://p.trellocdn.com 'unsafe-inline'; connect-src https://api.trello.com; frame-ancestors 'self' https://trello.com"
      );
      res.set("X-Frame-Options", "ALLOW-FROM https://trello.com");
      res.set("X-Content-Type-Options", "nosniff");
      res.set("Referrer-Policy", "strict-origin-when-cross-origin");
      res.set("Permissions-Policy", "geolocation=(), microphone=(), camera=()");
    },
  })
);
https.createServer(options, app).listen(8443);
