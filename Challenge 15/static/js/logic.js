// Create Map
const map = L.map('map').setView([40.7, -73.9], 4);

// Add a tile layer to the map
const tileLayerUrl = 'https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png';
const attribution = 'Map data © <a href="https://stadiamaps.com/">Stadia Maps</a> contributors';
const tileLayer = L.tileLayer(tileLayerUrl, { attribution }).addTo(map);

// Fetch earthquake data 
const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(url).then(function(data) {
  data.features.forEach(feature => {
    
    // Extract earthquake properties
    const magnitude = feature.properties.mag;
    const depth = feature.geometry.coordinates[2];
    const place = feature.properties.place;
    const time = new Date(feature.properties.time).toLocaleString();

    // Determine marker size based on earthquake magnitude
    const sizeThresholds = [2, 3, 4, 5];
    const sizeValues = [4, 8, 12, 16, 20];
    const size = sizeValues.find((value, i) => magnitude < sizeThresholds[i]) || sizeValues[sizeValues.length - 1];

    // Determine marker color based on earthquake depth
    const depthThresholds = [10, 30, 50, 70, 90];
    const depthColors = ['green', 'yellow', 'orange', 'red', 'darkred'];
    const color = depthColors.find((color, i) => depth < depthThresholds[i]) || depthColors[depthColors.length - 1];

    // Determine popup content
    const popupContent = JSON.stringify({
      place: place,
      magnitude: magnitude,
      depth: depth,
      time: time
    });
    

    // Create marker and add to the map
    const marker = L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], {
      color: color,
      fillOpacity: 0.1
    }).addTo(map);

    marker.bindPopup(popupContent);
  });

  // Create legend
const legend = L.control({ position: 'bottomright' });
legend.onAdd = function() {
  const div = L.DomUtil.create('div', 'info legend');
  div.innerHTML += '<div style="background:white;height:400px;width:300px;margin-top:1px;position:absolute;z-index:-1;"></div>';
  const depthThresholds = [10, 30, 50, 70, 90];
  const depthColors = ['lightgreen', 'yellow', 'orange', 'red', 'darkred'];
  for (let i = 0; i < depthThresholds.length; i++) {
    div.innerHTML += '<div><i style="background:' + depthColors[i] + '"></i></div><div>' + depthThresholds[i] + (depthThresholds[i + 1] ? '&ndash;' + depthThresholds[i + 1] + '<br>' : '+') + '</div>';
  }
  return div;
};
legend.addTo(map);

  


});
