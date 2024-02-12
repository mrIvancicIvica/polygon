import './style.css';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import { useGeographic } from 'ol/proj';
import { defaults as defaultControls, ZoomSlider } from 'ol/control';

useGeographic();


// Fetch the JSON data containing the polygon coordinates
fetch('polygon.json')
  .then(response => response.json())
  .then(data => {
    console.log(data)
    // Extract the coordinates from the JSON data
    const coordinates = data.polygon;

    // Create a vector source with the polygon geometry
    const vectorSource = new VectorSource({
      features: (new GeoJSON()).readFeatures({
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [coordinates] // Wrap the coordinates in an array
        }
      })
    });

    // Create a vector layer to display the polygon
    const vectorLayer = new VectorLayer({
      source: vectorSource
    });

    // Create the map
    const map = new Map({
      target: 'map',
      layers: [
        new TileLayer({
          source: new OSM()
        })
      ],
      view: new View({
        center: [0, 0],
        zoom: 2
      }),
      controls : defaultControls().extend([new ZoomSlider()])
    });

    // Add the vector layer to the map after map is created
    map.addLayer(vectorLayer);

    // Fit the map to the extent of the polygon
    map.getView().fit(vectorSource.getExtent(), { padding: [100, 100, 100, 100] });
  })
  .catch(error => {
    console.error('Error fetching or parsing JSON data:', error);
  });
