export const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
})

export const percentFormatter = new Intl.NumberFormat('en-US', {
  style: 'percent',
})

export const generateColors = total => {
  var i = 360 / (total - 1) // distribute the colors evenly on the hue range
  var cols = [] // hold the generated colors
  for (var x = 0; x < total; x++) {
    const [r, g, b] = hsvToRgb(i * x, 100, 100)
    const rgbString = `rgba(${r}, ${g}, ${b}, 0.5)`
    cols.push(rgbString) // you can also alternate the saturation and value for even more contrast between the colors
  }
  return cols
}

/**
 * HSV to RGB color conversion
 *
 * H runs from 0 to 360 degrees
 * S and V run from 0 to 100
 *
 * Ported from the excellent java algorithm by Eugene Vishnevsky at:
 * http://www.cs.rit.edu/~ncs/color/t_convert.html
 */
function hsvToRgb(h, s, v) {
  var r, g, b
  var i
  var f, p, q, t

  // Make sure our arguments stay in-range
  h = Math.max(0, Math.min(360, h))
  s = Math.max(0, Math.min(100, s))
  v = Math.max(0, Math.min(100, v))

  // We accept saturation and value arguments from 0 to 100 because that's
  // how Photoshop represents those values. Internally, however, the
  // saturation and value are calculated from a range of 0 to 1. We make
  // That conversion here.
  s /= 100
  v /= 100

  if (s == 0) {
    // Achromatic (grey)
    r = g = b = v
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)]
  }

  h /= 60 // sector 0 to 5
  i = Math.floor(h)
  f = h - i // factorial part of h
  p = v * (1 - s)
  q = v * (1 - s * f)
  t = v * (1 - s * (1 - f))

  switch (i) {
    case 0:
      r = v
      g = t
      b = p
      break

    case 1:
      r = q
      g = v
      b = p
      break

    case 2:
      r = p
      g = v
      b = t
      break

    case 3:
      r = p
      g = q
      b = v
      break

    case 4:
      r = t
      g = p
      b = v
      break

    default:
      // case 5:
      r = v
      g = p
      b = q
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)]
}
