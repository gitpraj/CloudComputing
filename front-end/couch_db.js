const NodeCouchDb = require('node-couchdb');
var tunnel = require('tunnel-ssh');
var cradle = require('cradle');


// var config = {
//     username:"ubuntu",
//     host:"115.146.93.148",
//     agent : process.env.SSH_AUTH_SOCK,
//     privateKey:require('fs').readFileSync('C:/Users/prajith/ccc2017-team8.pem'),
//
//     port:22,
//     dstPort:27017,
// };


var connection = new(cradle.Connection)('http://115.146.93.148', {auth: { username: 'admin', password: 'password' }});
var db = connection.database('tweets_temp');
db.exists(function (err, exists) {
    if (err) {
      console.log('error', err);
    } else if (exists) {
      console.log('the force is with you.');
    } else {
      console.log('database does not exists.');
    }
  });

  var db2 = connection.database('tweets_all');
  db2.exists(function (err, exists) {
      if (err) {
        console.log('error', err);
      } else if (exists) {
        console.log('the force is with you.');
      } else {
        console.log('database does not exists.');
      }
    });


  module.exports = {
    db: db,
    db2: db2
  }
