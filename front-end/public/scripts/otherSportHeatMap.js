var map;
//console.log("data:", data )
let data = $('.data').text();
//console.log("data", data );
data = JSON.parse(data);
console.log("data. in other google Maps: ", data);
var coords = [];

for (var i = 0; i < data.length; i++) {
    if (data[i].value.coords) {
        //coords.push()
        console.log("in heat map coords: ", data[i].value.coords);
        coords.push({lat: data[i].value.coords.coordinates[0], lng: data[i].value.coords.coordinates[1]})
    } else if (data[i].value.place) {
        //coords.push()
        console.log("in heat map places bouding box coords: ", data[i].value.place.bounding_box.coordinates[0][0]);
        coords.push({lat: data[i].value.place.bounding_box.coordinates[0][0][1], lng: data[i].value.place.bounding_box.coordinates[0][0][0]})
    }
}

console.log("coords in other map: ", coords)

var map, heatmap;

function initMap() {
  // var googleCoords = [];
  // for (var i = 0; i < coords.length; i++) {
  //     googleCoords.push(new google.maps.LatLng(coords[i].lat, coords[i].lng))
  // }
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 4,
    center: {lat: -24.476293, lng: 134.265866},
    // mapTypeId: 'satellite'
  });

  heatmap = new google.maps.visualization.HeatmapLayer({
    data: getPoints(google),
    map: map
  });
}

function toggleHeatmap() {
  heatmap.setMap(heatmap.getMap() ? null : map);
}

function changeGradient() {
  var gradient = [
    'rgba(0, 255, 255, 0)',
    'rgba(0, 255, 255, 1)',
    'rgba(0, 191, 255, 1)',
    'rgba(0, 127, 255, 1)',
    'rgba(0, 63, 255, 1)',
    'rgba(0, 0, 255, 1)',
    'rgba(0, 0, 223, 1)',
    'rgba(0, 0, 191, 1)',
    'rgba(0, 0, 159, 1)',
    'rgba(0, 0, 127, 1)',
    'rgba(63, 0, 91, 1)',
    'rgba(127, 0, 63, 1)',
    'rgba(191, 0, 31, 1)',
    'rgba(255, 0, 0, 1)'
  ]
  heatmap.set('gradient', heatmap.get('gradient') ? null : gradient);
}

function changeRadius() {
  heatmap.set('radius', heatmap.get('radius') ? null : 20);
}

function changeOpacity() {
  heatmap.set('opacity', heatmap.get('opacity') ? null : 0.2);
}
// Heatmap data: 500 Points
function getPoints(google) {
  var googleCoords = [];
  for (var i = 0; i < coords.length; i++) {
      googleCoords.push(new google.maps.LatLng(coords[i].lat, coords[i].lng))
  }
  return googleCoords;
}
