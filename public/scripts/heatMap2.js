
var map;
function initMap() {
  var heatMapData = [
    new google.maps.LatLng(37.782, -122.447),
  new google.maps.LatLng(37.782, -122.445),
  new google.maps.LatLng(37.782, -122.443),
  new google.maps.LatLng(37.782, -122.441),
  new google.maps.LatLng(37.782, -122.439),
  new google.maps.LatLng(37.782, -122.437),
  new google.maps.LatLng(37.782, -122.435),
  new google.maps.LatLng(37.785, -122.447),
  new google.maps.LatLng(37.785, -122.445),
  new google.maps.LatLng(37.785, -122.443),
  new google.maps.LatLng(37.785, -122.441),
  new google.maps.LatLng(37.785, -122.439),
  new google.maps.LatLng(37.785, -122.437),
  new google.maps.LatLng(37.785, -122.435)
  ];

  var sanFrancisco = new google.maps.LatLng(28.707336, 77.194345);

  map = new google.maps.Map(document.getElementById('map'), {
    center: sanFrancisco,
    zoom: 18,
    mapTypeId: 'satellite'
  });

  // var heatmap = new google.maps.visualization.HeatmapLayer({
  //   data: heatMapData
  // });
  // heatmap.setMap(map);


  var heatmap = new google.maps.visualization.HeatmapLayer({
    data: heatMapData,
    dissipating: false,
    map: map
  });

}
