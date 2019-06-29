var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.light",
  accessToken: API_KEY
});

var layers = {
  five_plus_magnitude: new L.LayerGroup(),
  four_to_five_magnitude: new L.LayerGroup(),
  three_to_four_magnitude: new L.LayerGroup(),
  two_to_three_magnitude: new L.LayerGroup(),
  one_to_two_magnitude: new L.LayerGroup(),
  zero_to_one_magnitude: new L.LayerGroup()
};

var map = L.map("map-id", {
  center: [15, 18],
  zoom: 2.5,
  layers: [
    layers.five_plus_magnitude,
    layers.four_to_five_magnitude,
    layers.three_to_four_magnitude,
    layers.two_to_three_magnitude,
    layers.one_to_two_magnitude,
    layers.zero_to_one_magnitude
  ]
});

lightmap.addTo(map);

var overlays = {
  "5+": layers.five_plus_magnitude,
  "4-5": layers.four_to_five_magnitude,
  "3-4": layers.three_to_four_magnitude,
  "2-3": layers.two_to_three_magnitude,
  "1-2": layers.one_to_two_magnitude,
  "0-1": layers.zero_to_one_magnitude
};

L.control.layers(null, overlays).addTo(map);

var info = L.control({
  position: "bottomright"
});

d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", function(earthquakeReq) {

    var earthquakeInfo = earthquakeReq.features;

    var stationCount = {
      five_plus_magnitude: 0,
      four_to_five_magnitude: 0,
      three_to_four_magnitude: 0,
      two_to_three_magnitude: 0,
      one_to_two_magnitude: 0,
      zero_to_one_magnitude: 0
    };

    var magnitudeCode;

    for (var i = 0; i < earthquakeInfo.length; i++) {

      var location = Object.assign({}, earthquakeInfo[i]);

      if (location.properties.mag >= 5) {
        magnitudeCode = "five_plus_magnitude";
        fillColor = "#FF0000";
      }
      else if (location.properties.mag >= 4) {
        magnitudeCode = "four_to_five_magnitude";
        fillColor = "#CA7B00";
      }

      else if (location.properties.mag >= 3) {
        magnitudeCode = "three_to_four_magnitude";
        fillColor = "#CEBB00";
      }

      else if (location.properties.mag >= 2) {
        magnitudeCode = "two_to_three_magnitude";
        fillColor = "#68D500";
      }

      else if (location.properties.mag >=1) {
        magnitudeCode = "one_to_two_magnitude";
        fillColor = "#00E158";
      }

      else {
        magnitudeCode= "zero_to_one_magnitude";
        fillColor = "#228B22";
      }

      stationCount[magnitudeCode]++;

      var newMarker = L.circle([location.geometry.coordinates[1], location.geometry.coordinates[0]], {
        radius: location.properties.mag * 25000,
        valueProperty: "mag",
        fillColor: fillColor,
        color: fillColor,
      });

      newMarker.addTo(layers[magnitudeCode]);

      newMarker.bindPopup("<p> Magnitude: " + location.properties.mag + "<br> Location: " + location.properties.place);
      
    }
    var legend = L.control({
      position: "bottomright"
    })

    legend.onAdd = function(){
      var div = L.DomUtil.create("div","info legend");
      var grades = [0,1,2,3,4,5];
      var colors = [
        "#228B22",
        "#00E158",
        "#68D500",
        "#CEBB00",
        "#CA7B00",
        "#FF0000"
      ];

      for (var i=0; i < grades.length; i++) {
        div.innerHTML +=
          "<i class = 'colorbox' style = 'background:" + colors[i] + "'></i>" +
          grades[i] + (grades[i+1] ? "&ndash;" + grades[i+1] +"<br><br>": "+");
      }
      return div;
    };

    legend.addTo(map);
});

