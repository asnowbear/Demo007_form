/**
 *
 * @param config
 * @constructor
 */
function Paint (config) {
  config = config ? config : {}
  this.map = null
  this._mouseDownPoint = null
  this._type = config.type || 'polygon'
  this.dataCollection = config.dataCollection
  this._tempPolygon = null
  this._tempPositions = null
  this._killCoordinate = null
  this.active = true
  this.drawEnd = config.drawEnd ? config.drawEnd : function() {}
  
  this._tempDatasource = {
    name: 'tempCollection',
    geos: []
  }
  
  window.onkeyup = (function (evt) {
    var keyCode = evt.keyCode
    if (keyCode === 27) {
      this._returnPrestepPainting()
    }
  }).bind(this)
  
}

Paint.prototype._returnPrestepPainting = function () {
  if (this._killCoordinate) {
    var len = this._tempPositions.length
    this._tempPositions.splice(len - 2, 1)
    this.map.refresh()
    
    if (this._tempPositions.length === 1) {
      this.flush()
    }
  }
}

Paint.prototype.handleEvent = function (evt) {
  if (!this.active) {
    return
  }
  
  var type = evt.type
  switch (type) {
    case EventTag.mouseDown:
      this.handleMouseDown(evt)
      break
    case EventTag.mouseMove:
      this.handleMouseMove(evt)
      break
    case EventTag.mouseUp:
      this.handleMouseUp(evt)
      break
  }
  
  return true
}

Paint.prototype.handleMouseDown = function (evt) {
  this._mouseDownPoint = [evt.mapX, evt.mapY]
}

Paint.prototype.handleMouseMove = function (evt) {
  if (this._killCoordinate) {
    this.updateDrawing(evt)
  }
}

Paint.prototype.updateDrawing = function (evt) {
  var pt = [evt.mapX, evt.mapY]
  
  var coordinates = this._tempPositions
  var last = coordinates[coordinates.length - 1]
  
  last[0] = pt[0]
  last[1] = pt[1]
  
  this._tempPolygon.setPosition(coordinates)
  this.map.refresh()
}


Paint.prototype.handleMouseUp = function (evt) {
  if (this._type === null) {
    return
  }
  
  var downPt = this._mouseDownPoint
  var clickPt = [evt.mapX, evt.mapY]

  var dx = downPt[0] - clickPt[0],
      dy = downPt[1] - clickPt[1]

  var dist = dx * dx + dy * dy

  if (dist <= 36) {
    if (!this._killCoordinate) {
      this._doDrawing(evt)
    }
    else if (this._shouldStopDrawing(evt)) {
      this._stopDrawing()
    }
    else {
      this._continuesToDrawing(evt)
    }
  }
}

Paint.prototype._shouldStopDrawing = function(evt) {
  var stop = false
  if (this._tempPolygon) {
    var potentiallyDone = this._tempPositions.length > 2
    var potentiallyFinishCoordinates = [this._tempPositions[0], this._tempPositions[this._tempPositions.length - 2]]
    
    var t1 = this.map.matrix.pixel
    
    var changeToPiexel = function (T, point) {
      var x = point[0]
      var y = point[1]
      point[0] = T[0] * x + T[2] * y + T[4]
      point[1] = T[1] * x + T[3] * y + T[5]
      return point
    }
    
    var vp = this.map.mapDom.getBoundingClientRect()
    var vpPt = [
      evt.oldEvent.clientX - vp.left,
      evt.oldEvent.clientY - vp.top
    ]
    
    if (potentiallyDone) {
      for (var  i = 0, ii = potentiallyFinishCoordinates.length; i < ii; i++) {
        var lastPt = potentiallyFinishCoordinates[i]
        var finishPixel = changeToPiexel(t1, lastPt.slice(0, 2))
        
        var dx = vpPt[0] - finishPixel[0]
        var dy = vpPt[1] - finishPixel[1]
        var snapTolerance = 8
        stop = Math.sqrt(dx * dx + dy * dy) <= snapTolerance
        
        if (stop) {
          this._killCoordinate = finishPixel
          break
        }
      }
    }
  }
  
  return stop
}

Paint.prototype._clearTempDatasource = function () {
  var dataSouce = this.map.datasource

  for(var i = 0, len = dataSouce.length ;i < len ;i ++) {
    var d = dataSouce[i]
    if (d.name === 'tempCollection') {
      d.geos = []
      break
    }
  }
}

Paint.prototype.flush = function () {
  this._killCoordinate = null
  this._tempDatasource.geos = []
  this._clearTempDatasource()
}

Paint.prototype._stopDrawing = function() {
  this.flush()

  var tempPositions = this._tempPositions
  tempPositions.pop()
  tempPositions.push(tempPositions[0])
  this._tempPolygon.setPosition(tempPositions)
  
  this.dataCollection.geos.push(this._tempPolygon)
  this.map.refresh()
  
  // 执行绘制完毕方法
  this.drawEnd(this._tempPolygon)
}

Paint.prototype._continuesToDrawing = function(evt) {
  var pt = [evt.mapX, evt.mapY]

  var coordinates = this._tempPositions
  coordinates.push(pt.slice())

  this._killCoordinate = coordinates[0]

  this._tempPolygon.setPosition(this._tempPositions)
  this.map.refresh()
}

Paint.prototype._doDrawing = function(evt) {
  var pt = [evt.mapX, evt.mapY]
  this._killCoordinate = pt

  this._tempPositions = [pt.slice(), pt.slice()]
  this._tempPolygon = null

  var polygon = new MyPolygon()
  polygon.tag = 'temp'
  polygon.setPosition(this._tempPositions)
  this._tempPolygon = polygon
  this._tempDatasource.geos.push(this._tempPolygon)

  this.map.refresh()
}

Paint.prototype.setMap = function(map) {
  this.map = map
  map.datasource.push(this._tempDatasource)
}

Paint.prototype.draw = function() {
  var map = this.map
  var datasource = map.datasource
  var map = this.map

  datasource.forEach(function(collection){
    collection.geos.forEach(function(geo){
      geo.draw(map.context, map)
    })
  })
}




