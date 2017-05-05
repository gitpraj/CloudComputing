var map;
//console.log("data:", data )
let data = $('.data').text();
console.log("data", data );
//data = JSON.parse(data);
//console.log("data. in google Maps: ", data);
// var coords = [{
//     lat: data[1],
//     longt: data[0]
// }]
// console.log("coords: ", coords);
function initMap() {
//   map = new google.maps.Map(document.getElementById('map'), {
//     zoom: 5,
//     center: {lat: -33.865427, lng: 151.196123},
//     mapTypeId: 'terrain'
//   });
//
//   // Create a <script> tag and set the USGS URL as the source.
//   // var script = document.createElement('script');
//   //
//   // // This example uses a local copy of the GeoJSON stored at
//   // // http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojsonp
//   // script.src = 'https://developers.google.com/maps/documentation/javascript/examples/json/earthquake_GeoJSONP.js';
//   // document.getElementsByTagName('head')[0].appendChild(script);
//   var heatmapData = [];
//   for (var i = 0; i < coords.length; i++) {
//     // var coords = results.features[i].geometry.coordinates;
//     var latLng = new google.maps.LatLng(coords[0].lat, coords[0].longt);
//     heatmapData.push(latLng);
//   }
//   var heatmap = new google.maps.visualization.HeatmapLayer({
//     data: heatmapData,
//     dissipating: false,
//     map: map
//   });
//
}

// function eqfeed_callback(results) {
//   var heatmapData = [];
//   for (var i = 0; i < results.features.length; i++) {
//     var coords = results.features[i].geometry.coordinates;
//     var latLng = new google.maps.LatLng(coords[1], coords[0]);
//     heatmapData.push(latLng);
//   }
//   var heatmap = new google.maps.visualization.HeatmapLayer({
//     data: heatmapData,
//     dissipating: false,
//     map: map
//   });
// }
