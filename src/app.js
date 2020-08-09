'use strict';

const express = require('express');
const router = require('./router');
const helmet = require('helmet');
const fs = require('fs');
const http = require('http');
const https = require('https');
const app = express();

const httpsOptions = {
    key: fs.readFileSync('src/ssl/key.pem'),
    cert: fs.readFileSync('src/ssl/trust-chain.crt'),
    passphrase: 'andreas'
}

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));
app.use(helmet());
app.set("views", "views");
app.set("view engine", "hbs");

app.use("/", router);

let httpServer = http.createServer(app);
let httpsServer = https.createServer(httpsOptions, app);

httpServer.listen(8080, () => {
    console.log("HTTP listening");
});

httpsServer.listen(8443, () => {
    console.log("HTTPS listening");
});