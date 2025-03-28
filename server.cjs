const cors = require("cors");
const express = require("express");

const app = express();
app.use(cors({ origin: "https://trello.com" }));
app.use(express.static("public"));
app.listen(3000);
