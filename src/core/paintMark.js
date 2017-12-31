/**
 *
 * @constructor
 */
function PaintMark () {
  this.mark = null
  this.active = true
}

PaintMark.prototype.onMousedown = function (e) {
  if (!this.active) {
    return
  }
  
  var mapEvent = this.map.coordinateMapping(e)
  this.mark = {
    x: mapEvent.mapX,
    y: mapEvent.mapY,
    radius: 10
  }
  
  this.map.refresh()
}

PaintMark.prototype.draw = function () {
  if (!this.active) {
    return
  }
  
  if (!this.mark) {
    return
  }
  
  var m = this.mark
  var points = [m.x, m.y]
  var invertMartrixFn = this.invertMartrix
  var tempPt = invertMartrixFn(points, 0, points.length, 2, this.map.matrix.pixel)
  
  var context = this.context
  context.save()
  context.fillStyle = 'rgba(255,0,0,0.6)'
  context.fillRect(tempPt[0] - m.radius/2, tempPt[1] - m.radius/ 2, m.radius, m.radius)
  context.restore()
}

PaintMark.prototype.setMap = function (map) {
  this.map = map
  
  this.context = map.context
  var container = map.mapDom
  
  var me = this
  $(container).mouseup(function(e){
    me.onMousedown(e)
  })
}

PaintMark.prototype.invertMartrix = function (c, offset, end, stride, T, opt_dest) {
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