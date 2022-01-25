export default {
  markers: {
    id: 'metro-stations-icon',
    type: 'circle',
    source: 'stations',
    name: 'Маркеры',
    paint: {
      'circle-color': '#4264fb',
      'circle-radius': 4
    }
  },
  titles: {
    id: 'metro-stations-name',
    type: 'symbol',
    source: 'stations',
    name: 'Названия станций',
    layout: {
      'text-field': ['get', 'name'],
      'text-size': 12,
      'text-offset': [0.5, 0],
      'text-anchor': 'left'
    },
    paint: {
      'text-color': '#555'
    }
  },
  lines: {
    id: 'metro-lines',
    type: 'line',
    source: 'lines',
    name: 'Линии',
    layout: {
      'line-cap': 'round'
    },
    paint: {
      'line-blur': 2,
      'line-width': 4
    }
  }
}
