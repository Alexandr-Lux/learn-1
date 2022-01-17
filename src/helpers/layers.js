export default {
  map: {
    container: 'mapContainer',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [37.58, 55.748],
    zoom: 11
  },
  metroMarkers: {
    id: 'metro-stations-icon',
    type: 'circle',
    source: 'stations',
    paint: {
      'circle-color': '#4264fb',
      'circle-radius': 5,
      'circle-stroke-width': 2,
      'circle-stroke-color': '#ffffff'
    }
  },
  metroTitles: {
    id: 'metro-stations-name',
    type: 'symbol',
    source: 'stations',
    layout: {
      'text-field': ['get', 'name'],
      'text-offset': [0.5, 0],
      'text-anchor': 'left'
    },
    paint: {
      'text-color': '#555'
    }
  }
}
