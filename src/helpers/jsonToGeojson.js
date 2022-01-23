export default function (json, type, id) {
  switch (id) {
    case 'stations':
      return {
        type: 'FeatureCollection',
        features: json.map(line => {
          return line.stations.map(station => {
            return {
              geometry: {
                type,
                coordinates: [station.lng, station.lat]
              },
              type: 'Feature',
              properties: {
                ...station
              }
            }
          })
        }).flat()
      }
    case 'lines':
      return {
        type: 'FeatureCollection',
        features: json.map(line => {
          return {
            geometry: {
              type,
              coordinates: line.coordinates.map(coord => [coord[1], coord[0]])
            },
            type: 'Feature',
            properties: {
              ...line
            }
          }
        })
      }
  }
}
