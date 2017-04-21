const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const config = require('../config/main');
const router = require('./router');
const app = express();

mongoose.Promise = require('bluebird');
mongoose.connect(config.dbUri);

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// CORS
if (config.cors) {
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials");
    res.header("Access-Control-Allow-Credentials", "true");
    if (req.method === 'OPTIONS') {
      res.status(200).send();
    } else {
      next();
    }
  })
}

app.use('/api', router);

let server = app.listen(config.port, () => {
  console.log(`Сервер запущен. Порт: ${config.port}`);
});

module.exports = server;