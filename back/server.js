'use strict';
/*
* ładowanie express i routera
*/
const express = require('express');
const routes = require('./routes.js');
/*
* urzywanie express w stałej app oraz ustawienie portu do nasłuchiwania
*/
const app = express();
const port = process.env.PORT || 8080;
/*
* ustawienie cors
*/
app.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

/*
* urzywanie routera w app
*/
app.use(routes);
/*
* nasłuchiwanie portu
*/
app.listen(port, (err) => {
  console.log(`App listening on port ${port}`);
});
