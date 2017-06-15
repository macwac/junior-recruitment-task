'use strict';
/*
 * ładowanie express i bodyParser
 */
const {Router} = require('express');
const bodyParser = require('body-parser');

/*
 * ładowanie kontrolera list
 */
const list = require('./controllers/list');

/*
 * router
 */
const apiRoutes = new Router();
/*
 * decodowanie html i parsowanie do json
 */
apiRoutes.use(bodyParser.urlencoded({
    extended: false
}));
apiRoutes.use(bodyParser.json());

/*
 * wykonywanie odpowiedniego kontrolera poprzez sprawdzenie metody (get,post,put,delete);
 */
apiRoutes.get('/', (req, res) => {
    list.get(req, res)
});

apiRoutes.post('/', (req, res) => {
    list.add(req, res);
});

apiRoutes.put('/', (req, res) => {
    list.edit(req, res);
});
apiRoutes.delete('/', (req, res) => {
    list.delete(req, res);
});


module.exports = apiRoutes
