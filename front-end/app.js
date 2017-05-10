//console.log("Express Routing Assignment");

var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var jsonfile = require('jsonfile')

var db = require('./couch_db.js')
//require('./mongo_db.js')
// var Afl = require('./mongo_models.js');

app.use(bodyParser.urlencoded({limit: '500mb',extended: true, parameterLimit: 50000}));
app.use(bodyParser.json({limit: '500mb'}))
//app.use(express.bodyParser());
app.use(express.static("public"));
app.use(express.static("build"));
app.use("/node_modules", express.static("node_modules"));
app.use("/views", express.static("views"));


// Routes
app.post("/landing/afl/:teamName/maps", function(req, res) {
  //console.log("in landing/afl/teamName/maps");
  //console.log("teamName: ", req.params.teamName);
  let body = req.body;
  let data = JSON.parse(body.data);
  //console.log("before rendering the teams url22222222: ", data)
  res.render("googleHeatMaps.ejs", {data:(data)});
});
// app.get("/landing/afl/:teamName/maps", function(req, res) {
//   db.db.view('aflteams/team', function (err, response) {
//           if (err) {
//             //console.log("error")
//           } else {
//             //console.log(response[0].key)
//             //console.log("value: ", response[0])
//             res.render("googleHeatMaps.ejs", {teamName:req.params.teamName, data:(JSON.stringify(response))});
//           }
//   });
// });


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

   //console.log("teamName: ", req.params.teamName);
  // let body = req.body;
  // let data = JSON.parse(body.data);
  // let teamName = req.params.teamName
  // //console.log("in landing/afl/teamName: ", data)
  ////console.log("before rendering the teams url: ", data);
  // var teamObj = []
  // for (var i = 0; i < data.length; i++) {
  //     if (data[i].key == teamName) {
  //       teamObj.push(data[i])
  //     } else {
  //       //do Nothing
  //     }
  // }
  // //console.log("team: ", teamObj)
  // res.render("aflTeam.ejs", {teamName:req.params.teamName, data:(data)});
    let teamName = req.params.teamName
    db.db.view('aflteams/team', function (err, response) {
            if (err) {
              //console.log("error")
            } else {
              //console.log(response[0].key)
              //console.log("value: ", response[0])
              var teamObj = []
              for (var i = 0; i < response.length; i++) {
                  if (response[i].key == teamName) {
                    teamObj.push(response[i])
                  } else {
                    //do Nothing
                  }
              }
              res.render("aflTeam.ejs", {teamName:teamName, data:(JSON.stringify(teamObj))});
            }
    });
});
// app.get("/landing/afl/:teamName", function(req, res) {
//     db.db.view('aflteams/team', function (err, response) {
//             if (err) {
//               //console.log("error")
//             } else {
//               //console.log(response[0].key)
//               //console.log("value: ", response[0])
//               res.render("aflTeam.ejs", {teamName:req.params.teamName, data:(JSON.stringify(response))});
//             }
//     });
// });



app.post("/landing/gender", function(req, res) {
  db.db.view('aflteams/gender', function (err, response) {
          if (err) {
            //console.log("error")
          } else {
            // var genderKeys = [];
            // for (var i = 0; i < response.length; i++) {
            //     if (genderKeys.indexOf(response[i].key) != -1) {
            //       // do nothing
            //     } else {
            //       genderKeys.push(response[i].key);
            //
            //     }
            // }
            //
            // //console.log("genderKeys: ", genderKeys)
            objtoSend = calculations(response);
            res.render("gender.ejs", {data:objtoSend});
          }
  });
});
app.get("/landing/gender", function(req, res) {
  db.db.view('aflteams/gender', function (err, response) {
          if (err) {
            ////console.log("error")
          } else {
            // var genderKeys = [];
            // for (var i = 0; i < response.length; i++) {
            //     if (genderKeys.indexOf(response[i].key) != -1) {
            //       // do nothing
            //     } else {
            //       genderKeys.push(response[i].key);
            //
            //     }
            // }
            //
            // //console.log("genderKeys: ", genderKeys)
            objtoSend = calculations(response);
            //console.log("objtoSend: ", objtoSend)
            res.render("gender.ejs", {data:objtoSend});
          }
  });
});
function calculations(response) {
    var genderMale = [], genderFemale = [], genderBrand = [];
    var genderBrandObj = [];
    var countMale = 0, countFemale = 0, countBrand = 0;
    ////console.log("lets see if thjis works: ", response)
    for (var i = 0; i < response.length; i++) {
        if (response[i].key == "male") {
            countMale++
            if (genderMale.indexOf(response[i].value.userid) != -1) {
              // do nothing
            } else {
              genderMale.push(response[i]);

            }
        } else if (response[i].key == "female") {
            countFemale++
            // if (genderFemale.indexOf(response[i].value.userid) != -1) {
            //   // do nothing
            // } else {
            //   genderFemale.push(response[i].value.userid);
            //
            // }
            genderFemale.push(response[i]);
        } else if (response[i].key == "brand") {
            countBrand++
            if (genderBrand.indexOf(response[i].value.userid) != -1) {
              // do nothing
            } else {
              genderBrand.push(response[i]);
              genderBrandObj.push({userid: response[i].value.userid, index:i});

            }
        }
    }

    var objGenderFemale = countDups(genderFemale);
    var objGenderMale = countDups(genderMale);
    var objGenderBrand = countDups(genderBrand);
    // //console.log(objGenderFemale)
    // //console.log(objGenderMale)
    // //console.log(objGenderBrand)
    // ////console.log("gender male: ", genderMale)
    // //console.log("male count: ", countMale)
    // // ////console.log("gender female: ", genderFemale)
    // //console.log("female count: ", countFemale)
    // // //console.log("gender brand: ", genderBrandObj)
    // //console.log("brand count: ", countBrand)
    return {
        countMale: countMale,
        countFemale: countFemale,
        countBrand: countBrand,
        objGenderMale: objGenderMale,
        objGenderFemale: objGenderFemale,
        objGenderBrand: objGenderBrand
    }
}
function countDups(gender) {
      var counter = [];
      for (var i = 0; i < gender.length; i += 1) {
        counter[gender[i].value.userid] = (counter[gender[i].value.userid] || 0) + 1;
      }

      ////console.log(counter);
      var large = 0;
      var largeKey, largeGender;
      for (var key in counter) {
        if (counter[key] > 1 && counter[key] > large) {
            large = counter[key];
            largeKey = key
            ////console.log("we have ", key, " duplicated ", counter[key], " times");
        }
      }

      for (var i = 0; i < gender.length; i += 1) {
          if (gender[i].value.userid == largeKey) {
              //console.log("adfdafdsff");
              largeGender = gender[i].key;
              largeUser = gender[i].value.userName
              break;
          }
      }
      ////console.log("large: ", large);
      //console.log("largeGender: ", largeGender)
      return {
         id: largeKey,
         count: large,
         gender: largeGender,
         user: largeUser
      }
}

app.post("/landing/afl", function(req, res) {
  db.db.view('aflteams/team', function (err, response) {
          if (err) {
            //console.log("error")
          } else {
            var sendKeys = [];
            for (var i = 0; i < response.length; i++) {
                if (sendKeys.indexOf(response[i].key) != -1) {
                  // do nothing
                } else {
                  sendKeys.push(response[i].key);

                }
            }

            //console.log("sendKeys: ", sendKeys)
            res.render("afl.ejs", {data:JSON.stringify(response), names:sendKeys});
          }
  });
});
// app.get("/landing/afl", function(req, res) {
//   db.db.view('aflteams/team', function (err, response) {
//           if (err) {
//             //console.log("error")
//           } else {
//             var sendKeys = [];
//             for (var i = 0; i < response.length; i++) {
//                 if (sendKeys.indexOf(response[i].key) != -1) {
//                   // do nothing
//                 } else {
//                   sendKeys.push(response[i].key);
//                 }
//             }
//             //console.log("sendKeys: ", sendKeys)
//             res.render("afl.ejs", {data:JSON.stringify(response), dataRaw: response, names:sendKeys});
//           }
//   });
// });



// app.get("/pie", function(req, res) {
//     db.db.view('aflteams/team', function (err, response) {
//             if (err) {
//               //console.log("error")
//             } else {
//               //console.log(response[0].key)
//               //console.log("value: ", response[0])
//               res.render("piechart.ejs", {data:JSON.stringify(response)} );
//             }
//     });
// });
app.post("/landing/afl/:teamName/pie", function(req, res) {
  //console.log("in post pie")
  let body = req.body;
  let data = JSON.parse(body.data);
  res.render("piechart.ejs", {teamName:req.params.teamName, data:data});

});



/* Other sports urls */

app.post("/landing/othersport", function(req, res) {
  db.db2.view('sport/otherSportView', function (err, response) {
          if (err) {
            //console.log("error")
          } else {
            var sendKeys = [];
            for (var i = 0; i < response.length; i++) {
                if (sendKeys.indexOf(response[i].key) != -1) {
                  // do nothing
                } else {
                  sendKeys.push(response[i].key);
                }
            }
            //console.log("sendKeys: ", sendKeys)
            res.render("otherSport.ejs", {data:JSON.stringify(response), dataRaw: response, names:sendKeys});
          }
  });
});

app.post("/landing/othersport/:sportName", function(req, res) {
    let sportName = req.params.sportName
    db.db2.view('sport/otherSportView', function (err, response) {
            if (err) {
              //console.log("error")
            } else {
              //console.log(response[0].key)
              //console.log("value: ", response[0])
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




app.listen(80, function() {
		console.log("Server running on port 80");
});
