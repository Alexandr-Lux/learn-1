const stationsFeatures = (json) => {
  const data = []

  json.forEach(line => {
    line.stations.forEach(station => {
      data.push({
        coordinates: [station.lng, station.lat],
        properties: {
          order: station.order,
          name: station.name,
          admArea: station.admArea,
          district: station.district,
          status: station.status,
          line: line.name,
          id: `${line.name}-${station.name}`
        }
      })
    })
  })
  return data
}

export { stationsFeatures }
