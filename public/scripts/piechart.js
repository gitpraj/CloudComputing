
let data2 = $('.data').text();
// console.log("data2", data2);
data2 = JSON.parse(data2);
//console.log("data2: ", data2);

var countPos = 0, countNeg = 0, countNeut = 0;
for (var i=0; i < data2.length; i++) {
    if (data2[i].value.sentiment == "positive") {
      //console.log(data2[i].value.sentiment)
      countPos++;
    } else if (data2[i].value.sentiment == "negative") {
      countNeg++;
    } else if (data2[i].value.sentiment == "neutral") {
      countNeut++;
    } else {

    }
}

var coords = [];
var senti = [];

for (var i = 0; i < data2.length; i++) {
    if (data2[i].value.coords) {
        //coords.push()
        //console.log("in heat map coords: ", data[i].value.coords);
        coords.push({lat: data2[i].value.coords.coordinates[0], lng: data2[i].value.coords.coordinates[1]})
        senti.push(data2[i].value.sentiment)
    } else if (data2[i].value.place) {
        //coords.push()
        //console.log("in heat map places bouding box coords: ", dat2a[i].value.place.bounding_box.coordinates[0][0]);
        coords.push({lat: data2[i].value.place.bounding_box.coordinates[0][0][1], lng: data2[i].value.place.bounding_box.coordinates[0][0][0]})
        senti.push(data2[i].value.sentiment)
    }
}


var bbox_vic = {
    xmin: -39.183161, xmax: -33.980647, ymin: 140.961682, ymax: 150.016968
}
var bbox_nsw = {
  xmax: -28.157020, xmin: -37.505280, ymax: 159.105444, ymin: 140.999279
}
var bbox_qld = {
  xmax: -9.210063, xmin: -29.177898, ymax: 153.649789, ymin: 137.995957
}
var bbox_nt = {
  xmax: -10.809854, xmin: -25.998618, ymax: 138.001200, ymin: 129.000476
}
var bbox_wa = {
  xmax: -13.610501, xmin: -35.213202, ymax: 129.001854, ymin: 112.760451
}
var bbox_sa = {
  xmax: -25.996377, xmin: -38.134591, ymax: 141.002956, ymin: 129.001340
}
var bbox_tas = {
  xmax: -39.129604, xmin: -44.055714, ymax: 148.616675, ymin: 143.708067
}


var global_coords_count_imp = 0;
function countTweetsState(coords, bbox) {
    var cnt = 0;
    if ((coords.lat > bbox.xmin) && (coords.lat < bbox.xmax) && (coords.lng > bbox.ymin) && (coords.lng < bbox.ymax)) {
        global_coords_count_imp++;
        return true;
    }
    return false;
}

var cnt_vic = 0;
for (var i = 0; i < coords.length; i++) {
    cnt_flag = countTweetsState(coords[i], bbox_vic)
    if (cnt_flag) {
        cnt_vic++;
    } else {

    }
}
console.log("coords length: ", coords.length)
console.log("cnt_vic: ", cnt_vic)

var cnt_nsw = 0;
for (var i = 0; i < coords.length; i++) {
    cnt_flag = countTweetsState(coords[i], bbox_nsw)
    if (cnt_flag) {
        cnt_nsw++;
    } else {

    }
}
console.log("cnt_nsw: ", cnt_nsw)

var cnt_qld = 0;
for (var i = 0; i < coords.length; i++) {
    cnt_flag = countTweetsState(coords[i], bbox_qld)
    if (cnt_flag) {
        cnt_qld++;
    } else {

    }
}
console.log("cnt_qld: ", cnt_qld)

var cnt_nt = 0;
for (var i = 0; i < coords.length; i++) {
    cnt_flag = countTweetsState(coords[i], bbox_nt)
    if (cnt_flag) {
        cnt_nt++;
    } else {

    }
}
console.log("cnt_nt: ", cnt_nt)

var cnt_wa = 0;
for (var i = 0; i < coords.length; i++) {
    cnt_flag = countTweetsState(coords[i], bbox_wa)
    if (cnt_flag) {
        cnt_wa++;
    } else {

    }
}
console.log("cnt_wa: ", cnt_wa)

var cnt_sa = 0;
for (var i = 0; i < coords.length; i++) {
    cnt_flag = countTweetsState(coords[i], bbox_sa)
    if (cnt_flag) {
        cnt_sa++;
    } else {

    }
}
console.log("cnt_sa: ", cnt_sa)

var cnt_tas = 0;
for (var i = 0; i < coords.length; i++) {
    cnt_flag = countTweetsState(coords[i], bbox_tas)
    if (cnt_flag) {
        cnt_tas++;
    } else {

    }
}
console.log("cnt_tas: ", cnt_tas)


console.log("global_coords_count_imp: ", global_coords_count_imp);
cnt_vic = ((cnt_vic / global_coords_count_imp) * 100)
console.log("cnt_vic: ", cnt_vic);
cnt_nsw = ((cnt_nsw / global_coords_count_imp) * 100)
console.log("cnt_nsw: ", cnt_nsw);
cnt_qld = ((cnt_qld / global_coords_count_imp) * 100)
console.log("cnt_qld: ", cnt_qld);
cnt_nt = ((cnt_nt / global_coords_count_imp) * 100)
console.log("cnt_nt: ", cnt_nt);
cnt_tas = ((cnt_wa / global_coords_count_imp) * 100)
console.log("cnt_was: ", cnt_wa);
cnt_sa = ((cnt_sa / global_coords_count_imp) * 100)
console.log("cnt_sa: ", cnt_sa);
cnt_tas =((cnt_tas / global_coords_count_imp) * 100)
console.log("cnt_tas: ", cnt_tas);

var ctx = document.getElementById("mychart");
var data = {
  labels: [
      "Positive",
      "Negative",
      "Neutral"
  ],
  datasets: [
      {
          data: [countPos, countNeg, countNeut],
          backgroundColor: [
              "#FF6384",
              "#36A2EB",
              "#FFCE56"
          ],
          hoverBackgroundColor: [
              "#FF6384",
              "#36A2EB",
              "#FFCE56"
          ]
      }]
  };
  var myPieChart = new Chart(ctx,{
      type: 'pie',
      data: data,
      // options: options
  });




  var ctx2 = document.getElementById("mychart1");
  var data22 = {
      labels: ["VIC", "NSW", "NT", "WA", "SA", "QLD", "TAS"],
      datasets: [
          {
              label: "% of Tweets within each state",
              backgroundColor: [
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(255, 206, 86, 0.2)',
                  'rgba(75, 192, 192, 0.2)',
                  'rgba(153, 102, 255, 0.2)',
                  'rgba(255, 159, 64, 0.2)'
              ],
              borderColor: [
                  'rgba(255,99,132,1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(255, 159, 64, 1)'
              ],
              borderWidth: 1,
              data: [cnt_vic,cnt_nsw, cnt_nt, cnt_wa, cnt_sa, cnt_qld, cnt_tas],
          }
      ]
  };

  var myBarChart = new Chart(ctx2, {
      type: 'bar',
      data: data22,
      // options: options
  });
