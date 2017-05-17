let dataGender = $('.data').text();
//console.log("data", data );
dataGender = JSON.parse(dataGender);
console.log("data. in gender 2: ", dataGender);

google.charts.load("current", {packages:["corechart","orgchart"]});
google.charts.setOnLoadCallback(drawChart);
function drawChart() {
  var data = google.visualization.arrayToDataTable([
    ['Gender', 'Number of Tweets'],
    ['Male',  dataGender.countMale],
    ['Female', dataGender.countFemale],
    ['Brands', dataGender.countBrand]
  ]);

  var options = {
    title: 'Gender',
    is3D: true,
  };

  var chart = new google.visualization.PieChart(document.getElementById('piechart_3d'));
  chart.draw(data, options);
}


// google.charts.load('current', {packages:["orgchart"]});
// google.charts.setOnLoadCallback(drawChart2);
//
// function drawChart2() {
//   var data = new google.visualization.DataTable();
//   data.addColumn('string', 'Name');
//   data.addColumn('string', 'Manager');
//   data.addColumn('string', 'ToolTip');
//
//   // For each orgchart box, provide the name, manager, and tooltip to show.
//   data.addRows([
//     [{v:'Mike', f:'Mike<div style="color:red; font-style:italic">President</div>'},
//      '', 'The President'],
//     [{v:'Jim', f:'Jim<div style="color:red; font-style:italic">Vice President</div>'},
//      'Mike', 'VP'],
//     ['Alice', 'Mike', ''],
//     ['Bob', 'Jim', 'Bob Sponge'],
//     ['Carol', 'Bob', '']
//   ]);
//
//   // Create the chart.
//   var chart = new google.visualization.OrgChart(document.getElementById('chart_div'));
//   // Draw the chart, setting the allowHtml option to true for the tooltips.
//   chart.draw(data, {allowHtml:true});
// }
