
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
      labels: ["January", "February", "March", "April", "May", "June", "July"],
      datasets: [
          {
              label: "My First dataset",
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
              data: [65, 59, 80, 81, 56, 55, 40],
          }
      ]
  };

  var myBarChart = new Chart(ctx2, {
      type: 'bar',
      data: data22,
      // options: options
  });
