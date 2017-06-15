'use strict';
/*
* ładowanie express i bazy danych
*/
const {Router} = require('express');
const express = require('express');
const db = require('./database');

/*
* urzywnie routera na api
*/
const api = require('./api');

const routes = new Router();

routes.use('/api', api);

module.exports = routes;
