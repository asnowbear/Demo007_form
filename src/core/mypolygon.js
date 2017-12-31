/**
 *
 * @constructor
 */
function MyPolygon () {
  this.coords = []
  this.feature = {}
  this.light = false
  this.display = true
  
  this.fillStyle = null
  
  this.id = uuid()
  this.displayText = ''
}

MyPolygon.prototype.setPosition = function (values) {
  this.coords = values
}

MyPolygon.prototype.getPosition = function () {
  return this.coords
}

MyPolygon.prototype.getEnvelop = function () {
  var coords = this.getPosition()
  if (coords.length === 0 ) {
    return null
  }
  
  var x0 = Number.POSITIVE_INFINITY
      y0 = Number.POSITIVE_INFINITY
      x1 = Number.NEGATIVE_INFINITY
      y1 = Number.NEGATIVE_INFINITY
  
  coords.forEach(function(point){
    x0 = Math.min(x0, point[0])
    y0 = Math.min(y0, point[1])
    x1 = Math.max(x1, point[0])
    y1 = Math.max(y1, point[1])
  })
  
  return [x0, y0, x1, y1]
}

MyPolygon.prototype.invertMartrix = function (c, offset, end, stride, T, opt_dest) {
  var dest = opt_dest ? opt_dest : []
  var i = 0, j
  
  for (j = offset; j < end; j += stride) {
    var x = c[j]
    var y = c[j + 1]
    dest[i++] = T[0] * x + T[2] * y + T[4]
    dest[i++] = T[1] * x + T[3] * y + T[5]
  }
  
  if (opt_dest && dest.length != i) {
    dest.length = i
  }
  
  return dest
}

MyPolygon.prototype.drawText = function (context, map) {
  var envelop = this.getEnvelop()
  var text = this.displayText
  if (text === '' || text === null) {
    return
  }
  
  context.save()
  context.strokeStyle = 'rgba(255,255,255,1)'
  context.fillStyle = 'rgba(255,0,0,1)'
  context.lineWidth = 2
  
  var invertMartrixFn = this.invertMartrix
  
  var cx = ( envelop[0] + envelop[2] ) / 2
      cy = ( envelop[1] + envelop[3] ) / 2
  
  var tempPt = invertMartrixFn([cx, cy], 0, 2, 2, map.matrix.pixel)
  
  
  context.strokeText(text, tempPt[0], tempPt[1])
  context.fillText(text, tempPt[0], tempPt[1])
  
  context.restore()
}

MyPolygon.prototype.drawLight = function (context, styleConfig, points) {
  if (this.light === false) {
    return
  }
  
  context.save()
  context.fillStyle = 'rgba(255,0,0,0.6)'
  points.forEach(function(p){
    context.fillRect(p[0] - 7/2, p[1] - 7/2, 7, 7)
  })
  
  context.restore()
}

MyPolygon.prototype.draw = function (context, map) {
  if (this.display === false) {
    return
  }
  
  var oldCoords = this.coords
  if (oldCoords.length === 0) {
    return
  }
  
  this.drawText(context, map)
  
  var coords = []
  var invertMartrixFn = this.invertMartrix,
       martrix = map.matrix.pixel
  
  oldCoords.forEach(function(points){
    var tempPt = invertMartrixFn(points, 0, points.length, 2, martrix)
    tempPt[0] = (tempPt[0] + 0.5) | 0
    tempPt[1] = (tempPt[1] + 0.5) | 0
  
    coords.push(tempPt)
  })
  
  var config = Config.style
  
  this.drawLight(context, config, coords)
  
  context.save()
  context.beginPath()
  
  context.moveTo(coords[0][0],coords[0][1])
  for (var i = 0, len = coords.length ; i < len ; i ++){
    var pts = coords[i]
    context.lineTo(pts[0], pts[1])
  }
  
  context.closePath()

  context.fillStyle = config.fillStyle
  context.fill()

  context.strokeStyle = config.strokeStyle.color
  context.lineWidth = config.strokeStyle.width
  context.stroke()
  
  context.restore()
}