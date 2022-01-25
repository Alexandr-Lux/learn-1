export default function (data) {
  const colorsCondition = ['match', ['get', 'hex_color']]

  data.features.forEach(el => {
    colorsCondition.push(el.properties.hex_color)
    colorsCondition.push(`#${el.properties.hex_color}`)
  })

  colorsCondition.push('#f0f')

  return colorsCondition
}
