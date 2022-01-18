export default {
  metroMarkers: {
    id: 'metro-stations-icon',
    type: 'circle',
    source: 'stations',
    paint: {
      'circle-color': '#4264fb',
      'circle-radius': 5
    }
  },
  metroTitles: {
    id: 'metro-stations-name',
    type: 'symbol',
    source: 'stations',
    layout: {
      'text-field': ['get', 'name'],
      'text-size': 12,
      'text-offset': [0.5, 0],
      'text-anchor': 'left'
    },
    paint: {
      'text-color': '#555'
    }
  }
}
