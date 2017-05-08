console.log("Express Routing Assignment");

var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var jsonfile = require('jsonfile')

var db = require('./couch_db.js')
//require('./mongo_db.js')
// var Afl = require('./mongo_models.js');

app.use(bodyParser.urlencoded({limit: '1000mb',extended: true, parameterLimit: 500000}));
app.use(bodyParser.json({limit: '1000mb'}))
//app.use(express.bodyParser());
app.use(express.static("public"));
app.use(express.static("build"));
app.use("/node_modules", express.static("node_modules"));
app.use("/views", express.static("views"));


// Routes
app.post("/landing/afl/:teamName/maps", function(req, res) {
  console.log("in landing/afl/teamName/maps");
  console.log("teamName: ", req.params.teamName);
  let body = req.body;
  let data = JSON.parse(body.data);
  console.log("before rendering the teams url22222222: ", data)
  res.render("googleHeatMaps.ejs", {data:(data)});
});
app.get("/landing/afl/:teamName/maps", function(req, res) {
  db.db.view('aflteams/team', function (err, response) {
          if (err) {
            console.log("error")
          } else {
            console.log(response[0].key)
            console.log("value: ", response[0])
            res.render("googleHeatMaps.ejs", {teamName:req.params.teamName, data:(JSON.stringify(response))});
          }
  });
});


// app.get("/home2", function(req, res) {
// 	res.render("heatMap2.ejs");
// });
app.get("/", function(req, res) {
	res.render("landingPage.ejs");
});

app.get("/landing", function(req, res) {
	res.render("landingPage.ejs");
});



app.post("/landing/afl/:teamName", function(req, res) {

   console.log("teamName: ", req.params.teamName);
  let body = req.body;
  let data = JSON.parse(body.data);
  console.log("in landing/afl/teamName: ", data)
  //console.log("before rendering the teams url: ", data);
  res.render("aflTeam.ejs", {teamName:req.params.teamName, data:(data)});
  let teamName = req.params.teamName
    // db.db.view('aflteams/team', function (err, response) {
    //         if (err) {
    //           console.log("error")
    //         } else {
    //           console.log(response[0].key)
    //           console.log("value: ", response[0])
    //           var teamObj = []
    //           for (var i = 0; i < response.length; i++) {
    //               if (response[i].key == teamName) {
    //                 teamObj.push(response[i])
    //               } else {
    //                 //do Nothing
    //               }
    //           }
    //           res.render("aflTeam.ejs", {teamName:teamName, data:(JSON.stringify(teamObj))});
    //         }
    // });
});
app.get("/landing/afl/:teamName", function(req, res) {
    db.db.view('aflteams/team', function (err, response) {
            if (err) {
              console.log("error")
            } else {
              console.log(response[0].key)
              console.log("value: ", response[0])
              res.render("aflTeam.ejs", {teamName:req.params.teamName, data:(JSON.stringify(response))});
            }
    });
});



app.post("/landing/afl", function(req, res) {
  db.db.view('aflteams/team', {group: false, reduce: false}, function (err, response) {
          if (err) {
            console.log("error")
          } else {
            var sendKeys = [];
            for (var i = 0; i < response.length; i++) {
                if (sendKeys.indexOf(response[i].key) != -1) {
                  // do nothing
                } else {
                  sendKeys.push(response[i].key);

                }
            }

            console.log("sendKeys: ", sendKeys)
            res.render("afl.ejs", {data:JSON.stringify(response), dataRaw: response, names:sendKeys});
          }
  });
});
app.get("/landing/afl", function(req, res) {
  db.db.view('aflteams/team', function (err, response) {
          if (err) {
            console.log("error")
          } else {
            var sendKeys = [];
            for (var i = 0; i < response.length; i++) {
                if (sendKeys.indexOf(response[i].key) != -1) {
                  // do nothing
                } else {
                  sendKeys.push(response[i].key);
                }
            }
            console.log("sendKeys: ", sendKeys)
            res.render("afl.ejs", {data:JSON.stringify(response), dataRaw: response, names:sendKeys});
          }
  });
});



app.get("/pie", function(req, res) {
    db.db.view('aflteams/team', function (err, response) {
            if (err) {
              console.log("error")
            } else {
              console.log(response[0].key)
              console.log("value: ", response[0])
              res.render("piechart.ejs", {data:JSON.stringify(response)} );
            }
    });
});
app.post("/landing/afl/:teamName/pie", function(req, res) {
  console.log("in post pie")
  let body = req.body;
  let data = JSON.parse(body.data);
  res.render("piechart.ejs", {teamName:req.params.teamName, data:data});

});



/* Other sports urls */

app.post("/landing/othersport", function(req, res) {
  db.db2.view('sport/otherSportView', function (err, response) {
          if (err) {
            console.log("error")
          } else {
            var sendKeys = [];
            for (var i = 0; i < response.length; i++) {
                if (sendKeys.indexOf(response[i].key) != -1) {
                  // do nothing
                } else {
                  sendKeys.push(response[i].key);
                }
            }
            console.log("sendKeys: ", sendKeys)
            res.render("otherSport.ejs", {data:JSON.stringify(response), dataRaw: response, names:sendKeys});
          }
  });
});

app.post("/landing/othersport/:sportName", function(req, res) {
    let sportName = req.params.sportName
    db.db2.view('sport/otherSportView', function (err, response) {
            if (err) {
              console.log("error")
            } else {
              console.log(response[0].key)
              console.log("value: ", response[0])
              var teamObj = []
              for (var i = 0; i < response.length; i++) {
                  if (response[i].key == sportName) {
                    teamObj.push(response[i])
                  } else {
                    //do Nothing
                  }
              }
              res.render("otherSportHeatMap.ejs", {sportName:sportName, data:(JSON.stringify(teamObj))});
            }
    });
});

app.get("/heatheatMap", function(req, res) {
    res.render("otherSportHeatMap.ejs")
});




app.listen(5000, function() {
		console.log("Server running on port 5000");
});
