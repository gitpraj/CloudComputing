
let data2 = $('.data').text();
console.log("data2", data2);
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
