const NodeCouchDb = require('node-couchdb');
var tunnel = require('tunnel-ssh');
var cradle = require('cradle');


var config = {
    username:"ubuntu",
    host:"115.146.93.148",
    agent : process.env.SSH_AUTH_SOCK,
    privateKey:require('fs').readFileSync('C:/Users/prajith/ccc2017-team8.pem'),

    port:22,
    dstPort:27017,
};


var connection = new(cradle.Connection)('http://115.146.93.148', {auth: { username: 'admin', password: 'password' }});
var db = connection.database('tweets2');
db.exists(function (err, exists) {
    if (err) {
      console.log('error', err);
    } else if (exists) {
      console.log('the force is with you.');
    } else {
      console.log('database does not exists.');
    }
  });

  var resp = {}



  db.view('aflteams/team', function (err, response) {
          if (err) {
            console.log("error")
          } else {
            // var sendKeys = [];
            // for (var i = 0; i < response.length; i++) {
            //     if (sendKeys.indexOf(response[i].key) != -1) {
            //       // do nothing
            //     } else {
            //       sendKeys.push(response[i].key);
            //     }
            // }
            // console.log("sendKeys: ", sendKeys)
            //res.render("afl.ejs", {data:JSON.stringify(response)});
            resp = response;
            console.log("before rendering the teams url")
            //res.render("googleHeatMaps.ejs", {data:JSON.stringify(data)})
            //res.render("aflTeam.ejs", {teamName:req.params.teamName, data:JSON.stringify(response)});
          }
  });

  console.log("resp: ", resp)

  module.exports = {
    db: db
  }
