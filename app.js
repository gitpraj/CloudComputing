console.log("Express Routing Assignment");

var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var jsonfile = require('jsonfile')

var db = require('./couch_db.js')


// db.db.view('aflteams/team', function (err, response) {
//         if (err) {
//           console.log("error")
//         } else {
//           //console.log("think its successful", response);
//           // response.forEach(function (key, row) {
//           //   // print out to console it's name and isHyperlink flag
//           //     //console.log(row);
//           //     console.log(key)
//           // });
//           console.log(response[0].key)
//           console.log("value: ", response[0])
//         }
// });

app.use(bodyParser.urlencoded({limit: '500mb',extended: true, parameterLimit: 50000}));
app.use(bodyParser.json({limit: '500mb'}))
//app.use(express.bodyParser());
app.use(express.static("public"));
app.use(express.static("build"));
app.use("/node_modules", express.static("node_modules"));
app.use("/views", express.static("views"));

//Body Parser
// app.use(bodyParser.json({
//     limit: '50mb'
// }));
// app.use(bodyParser.urlencoded({
//     limit: '50mb',
//     extended: true
// }));






// Routes
app.post("/landing/afl/:teamName/maps", function(req, res) {
  console.log("in landing/afl/teamName/maps");
  console.log("teamName: ", req.params.teamName);
  let body = req.body;
  let data = JSON.parse(body.data);
  //let data = body.data
  // console.log("data: in post teamname/maps: ", data);
  // db.db.view('aflteams/team', function (err, response) {
  //         if (err) {
  //           console.log("error")
  //         } else {
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
            console.log("before rendering the teams url22222222")
            //res.render("googleHeatMaps.ejs", {data:JSON.stringify(data)})
            //res.render("aflTeam.ejs", {teamName:req.params.teamName})
            res.render("googleHeatMaps.ejs", {data:JSON.stringify(data)});
  //         }
  // });

});





app.get("/home2", function(req, res) {
	res.render("heatMap2.ejs");
});



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
  //let data = body.data
  //console.log("data: in post: ", body);
  // db.db.view('aflteams/team', function (err, response) {
  //         if (err) {
  //           console.log("error")
  //         } else {
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
            console.log("before rendering the teams url")
            //res.render("googleHeatMaps.ejs", {data:JSON.stringify(data)})
            res.render("aflTeam.ejs", {teamName:req.params.teamName, data:JSON.stringify(data)});
  //         }
  // });

});

app.post("/landing/afl", function(req, res) {
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
            //console.log("think its successful", response);
            // response.forEach(function (key, row) {
            //   // print out to console it's name and isHyperlink flag
            //     //console.log(row);
            //     console.log(key)
            // });
            console.log(response[0].key)
            console.log("value: ", response[0])
            res.render("piechart.ejs", {data:JSON.stringify(response)} );
          }
  });

});

app.post("/pie", function(req, res) {
  console.log("in post pie")
  let body = req.body;
//  console.log(body)
  let data = JSON.parse(body.data);
  //console.log("data: in post teamname/maps: ", data);
  db.db.view('aflteams/team', function (err, response) {
          if (err) {
            console.log("error")
          } else {
            //console.log("think its successful", response);
            // response.forEach(function (key, row) {
            //   // print out to console it's name and isHyperlink flag
            //     //console.log(row);
            //     console.log(key)
            // });
            console.log(response[0].key)
            console.log("value: ", response[0])
            res.render("piechart.ejs", {data:JSON.stringify(response)});
          }
  });

});

// app.get("*", function(req, res) {
// 	res.send("Sorry, page not found...");
// });

app.listen(5000, function() {
		console.log("Server running on port 5000");
});