// Setup Map
var map = new maplibregl.Map({
container: 'map',
style: 'tiles/style_greyscale.json' ,
center: [-3.1382,55.9533],
zoom: 8,
maxZoom: 19,
minZoom: 5,
maxPitch: 85,
hash: true
});

// Geocoding API
var geocoder_api = {
  forwardGeocode: async (config) => {
    const features = [];
    try {
      let request = 'https://nominatim.openstreetmap.org/search?q=' +
      config.query + '&format=geojson&polygon_geojson=1&addressdetails=1&countrycodes=gb';
    const response = await fetch(request);
    const geojson = await response.json();
    for (let feature of geojson.features) {
      let center = [feature.bbox[0] + (feature.bbox[2] - feature.bbox[0]) / 2,
        feature.bbox[1] + (feature.bbox[3] - feature.bbox[1]) / 2];
      let point = {type: 'Feature',geometry: {type: 'Point',coordinates: center},
      place_name: feature.properties.display_name,
      properties: feature.properties,
      text: feature.properties.display_name,
      place_type: ['place'],
      center: center
      };
      features.push(point);
      }
    } catch (e) {
      console.error(`Failed to forwardGeocode with error: ${e}`);
    }
 
    return {
      features: features
    };
  }
};
map.addControl(
  new MaplibreGeocoder(geocoder_api, {
  maplibregl: maplibregl
  })
);

// pmtiles
let protocol = new pmtiles.Protocol();
maplibregl.addProtocol("pmtiles",protocol.tile);

map.on('load', function() {

// Add Controls to the Map
map.addControl(new maplibregl.NavigationControl(), 'top-left');

map.addControl(
new maplibregl.TerrainControl({source: 'terrainSource',exaggeration: 1.25})
,'top-left');

map.addControl(new maplibregl.GeolocateControl({
positionOptions: {enableHighAccuracy: true},
trackUserLocation: true})
,'top-left');

map.addControl(new maplibregl.FullscreenControl(), 'top-left');

map.addControl(new maplibregl.AttributionControl({
  compact: true,
  customAttribution: 'Contains OS data © Crown copyright 2021, Satelite map © ESRI 2023, © OpenStreetMap contributors'
  
}));

map.addControl(new maplibregl.ScaleControl({
  maxWidth: 80,
  unit: 'metric'
}),'bottom-right');

// Add Data Sources
map.addSource('rnet', {
	'type': 'vector',
	'url': 'pmtiles://https://www.wisemover.co.uk/pmtiles/nptscot/rnet.pmtiles',
});

map.addSource('zones', {
	'type': 'vector',
	'tiles': [
	'https://www.wisemover.co.uk/tiles/zones/{z}/{x}/{y}.pbf'
	],
	'minzoom': 6,
	'maxzoom': 12,
	'bounds': [-8.649240,54.633160,-0.722602,60.861379]
});

map.addSource('data_zones', {
	'type': 'vector',
	'tiles': [
	'https://www.wisemover.co.uk/tiles/data_zones/{z}/{x}/{y}.pbf'
	],
	'minzoom': 6,
	'maxzoom': 12,
	'bounds': [-8.649240,54.633160,-0.722602,60.861379]
});

map.addSource('la', {
	'type': 'vector',
	'tiles': [
	'https://www.wisemover.co.uk/tiles/la/{z}/{x}/{y}.pbf'
	],
	'minzoom': 6,
	'maxzoom': 12,
	'bounds': [-8.650007,49.864674,1.763680,60.860766]
});

map.addSource('wards', {
	'type': 'vector',
	'tiles': [
	'https://www.wisemover.co.uk/tiles/wards/{z}/{x}/{y}.pbf'
	],
	'minzoom': 6,
	'maxzoom': 12,
	'bounds': [-8.650007,49.864674,1.763680,60.860766]
});

map.addSource('westminster', {
	'type': 'vector',
	'tiles': [
	'https://www.wisemover.co.uk/tiles/westminster/{z}/{x}/{y}.pbf'
	],
	'minzoom': 6,
	'maxzoom': 12,
	'bounds': [-8.650007,49.864674,1.763680,60.860766]
});

map.addSource('holyrood', {
	'type': 'vector',
	'tiles': [
	'https://www.wisemover.co.uk/tiles/holyrood/{z}/{x}/{y}.pbf'
	],
	'minzoom': 6,
	'maxzoom': 12,
	'bounds': [-8.650007,49.864674,1.763680,60.860766]
});

map.addSource('satellite', {
	'type': 'raster',
	'tiles': [
	'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
	],
	'tileSize': 256
});


map.addSource('opencyclemap', {
	'type': 'raster',
	'tiles': [
	'https://tile.thunderforest.com/cycle/{z}/{x}/{y}.png?apikey=bf09fff64f1443028994661047c077f5'
	],
	'tileSize': 256
});


map.addSource('terrainSource', {
  'type': 'raster-dem',
  'tiles': ["https://www.carbon.place/rastertiles/demwebp/{z}/{x}/{y}.webp"],
  'tileSize': 512,
  'minzoom': 0,
	'maxzoom': 9,
	'bounds': [-8.650007,49.864674,1.763680,60.860766]
});

map.addSource('hillshadeSource', {
  'type': 'raster-dem',
  'tiles': ["https://www.carbon.place/rastertiles/demwebp/{z}/{x}/{y}.webp"],
  'tileSize': 512,
  'minzoom': 0,
	'maxzoom': 9,
	'bounds': [-8.650007,49.864674,1.763680,60.860766]
});

map.addLayer(
{
'id': 'hillshading',
'source': 'hillshadeSource',
'type': 'hillshade',
'bounds': [-8.650007,49.864674,1.763680,60.860766]
},
'sea'
);

// Setup other part of the website
showrighbox(true); // Show the accordion hide the button 
show_rnet_legend(true); // Show the legend hide the button 
toggleLayer('rnet'); // Start with the rnet on
toggleLayer('zones');
toggleLayer('data_zones');
toggleLayer('la');
toggleLayer('wards');
toggleLayer('westminster');
toggleLayer('holyrood');
toggleraster();

});



