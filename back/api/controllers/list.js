'use strict';
/*
 * ładowanie bazy danych oraz htmlencode
 */
const db = require('../../database');
const htmlencode = require('htmlencode').htmlEncode;

/*
 * lista funkcji wykonujących odpowiednie zapytania do bazy danych i zwracająca odopowiedni JSON
 */
const list  = {

  get :(req, res) => {
      var todos = [];
      db.serialize(function() {
          db.each("SELECT * FROM list", function(err, row) {
              todos.push({id: row.id, name: row.name, status: row.status})
          }, function(err) {
              if(err == null){
                  res.writeHead(200, {"Content-Type": "application/json"});
                  res.end(JSON.stringify({return: true, data: todos}))
              } else {
                  res.writeHead(400, {"Content-Type": "application/json"});
                  res.end(JSON.stringify({return: false,data: err}))
              }
          })
      })
  },

  add : (req,res) => {
      db.serialize(() => {
          var stmt = db.prepare(`INSERT into list (name,status) VALUES(?,?)`)
          stmt.run(htmlencode(req.body.name),'1');
          stmt.finalize((err) =>{
              if(err == null){
                  res.writeHead(200, {"Content-Type": "application/json"})
                  res.end(JSON.stringify({return:true}));
              } else {
                  res.writeHead(400, {"Content-Type": "application/json"})
                  res.end(JSON.stringify({return:false,data:err}));
              }

          });
      });
  },

  edit : (req,res) =>{
      var status = req.body.status;
      var id = req.body.id;
      if(isNaN(id) || isNaN(status)){
          res.writeHead(400, {"Content-Type": "application/json"});
          res.end(JSON.stringify({return: false, data:'id or status is not a number'}))
          return;
      }
      db.serialize(() =>{
         var stmt = db.prepare(`UPDATE list SET status = $status WHERE id=$id`,{
             $status : status,
             $id :id
         })
         stmt.run(function(err){
             if(err == null){
                 res.writeHead(200, {"Content-Type": "application/json"});
                 res.end(JSON.stringify({return: true}))
             } else {
                 res.writeHead(400, {"Content-Type": "application/json"});
                 res.end(JSON.stringify({return: false, reason: err}))
                 console.error('UPDATE error');
             }
         });
      });
  },

  delete: (req,res) =>{
      db.serialize(() =>{
         var stmt = db.prepare(`DELETE FROM list WHERE id=$id`,{
             $id : req.body.id
         })
         stmt.run(function(err){
             if(err == null){
                 res.writeHead(200, {"Content-Type": "application/json"});
                 res.end(JSON.stringify({return: true}))
             } else {
                 res.writeHead(401, {"Content-Type": "application/json"});
                 res.end(JSON.stringify({return: false, reason: err}))
                 console.error('DELETE error');
             }
         });
      });
  }

}

module.exports = list;
