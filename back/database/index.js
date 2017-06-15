/*
* ładowanie sqlite oraaz fs
*/
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

/*
* nowa instacja bazy danych
*/
const dbfile = 'test.db';
const db = new sqlite3.Database(dbfile);
/*
* jesli baza nie isttnieje uruchamia się model list
*/
if (!fs.existsSync(dbfile)) {

    const list = require('./models/list');
    db.run(list);
}


module.exports = db;
