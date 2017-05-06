var map;
//console.log("data:", data )
let data = $('.data').text();
//console.log("data", data );
data = JSON.parse(data);
console.log("data. in google Maps: ", data);
var coords = [];
var senti = [];

for (var i = 0; i < data.length; i++) {
    if (data[i].value.coords) {
        //coords.push()
        console.log("in heat map coords: ", data[i].value.coords);
        coords.push({lat: data[i].value.coords.coordinates[0], lng: data[i].value.coords.coordinates[1]})
        senti.push(data[i].value.sentiment)
    } else if (data[i].value.place) {
        //coords.push()
        console.log("in heat map places bouding box coords: ", data[i].value.place.bounding_box.coordinates[0][0]);
        coords.push({lat: data[i].value.place.bounding_box.coordinates[0][0][1], lng: data[i].value.place.bounding_box.coordinates[0][0][0]})
        senti.push(data[i].value.sentiment)
    }
}


function addMarker(location, map, senti) {
        // Add the marker at the clicked location, and add the next-available label
        // from the array of alphabetical characters.

        //http://maps.google.com/mapfiles/ms/icons/blue-dot.png
        var icon;
        if (senti == "positive") {
          icon = 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
        } else if (senti == "negative") {
          icon = ''
        } else if (senti == "neutral"){
          icon = 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
        }
        var marker = new google.maps.Marker({
          position: location,
          //label: labels[labelIndex++ % labels.length],
          title:"Hello",
          icon: icon,
          map: map
        });
}

function initMap() {

  //var myLatLng = {lat: -25.363, lng: 131.044};
  console.log("coords for markers: ", coords);
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 4,
    center: coords[0]
  });

  for (var i = 0; i < coords.length; i++) {
     addMarker(coords[i], map, senti[i]);
  }
}
