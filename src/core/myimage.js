/**
 *
 * @param url
 * @constructor
 */
function MyImage (url) {
  this._map = null
  this.context = null
  this.imageWidth = 0
  this.imageHeight = 0
}

MyImage.prototype.setMap = function (map) {
  this._map = map
  this.context = map.context
  
  var img = new Image()
  img.src = url
  
  this.loaded = false
  
  img.onload = (function () {
    this.loaded = true
    this.imageHeight = img.height
    this.imageWidth = img.width
  
    map.center = [this.imageWidth / 2, this.imageHeight / 2]
    map.refresh()
  }).bind(this)
  
  this.image = img
}


MyImage.prototype.draw = function () {

  if (!this.loaded) {
    return
  }
  
  var context = this.context
  // 处理
  var image = this.image
  var imageWidth = this.imageWidth
  var imageHeight = this.imageHeight
  
  var imageExtent = [0, 0, imageWidth, imageHeight]
  
  var map = this._map
  var center = map.center,
      size = map.size,
      lev = map.getLevel(map.level)
  
  var s = 1 / (lev * 1)
  
  var dx1 = size[0] / 2,
      dy1 = size[1] / 2,
      sx = s,
      sy = -s,
      angle = 0,
      dx2 = 1 * (imageExtent[0] - center[0]) / 1,
      dy2 = 1 * (center[1] - imageExtent[3]) / 1

  var T = [1, 0, 0, 1, 0, 0]

  var sin = Math.sin(angle)
  var cos = Math.cos(angle)
  T[0] = sx * cos
  T[1] = sy * sin
  T[2] = -sx * sin
  T[3] = sy * cos
  T[4] = dx2 * sx * cos - dy2 * sx * sin + dx1
  T[5] = dx2 * sy * sin + dy2 * sy * cos + dy1
  
  var dx = T[4],
      dy = T[5],
      dw = imageWidth * T[0],
      dh = imageHeight * T[3]
  
  context.drawImage(image, 0, 0, imageWidth, imageHeight, dx, dy, dw, dh)
}