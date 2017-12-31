/**
 *
 * @constructor
 */
function Nav () {
  this.map = null
  this._lastPt = null
  this.active = true
  this.beginNav = false
  this.onNaving = false
}

Nav.prototype.handleEvent = function (evt) {
  if (!this.active) {
    return
  }
  
  var ok = true
  var type = evt.type
  switch (type) {
    case EventTag.mouseDown:
      this.handleMouseDown(evt)
      break
    case EventTag.mouseMove:
      this.handleMouseMove(evt)
      break
    case EventTag.mouseUp:
      ok = this.handleMouseUp(evt)
      break
    case EventTag.mouseWheel:
    case EventTag.wheel:
      this.handleMouseWheel(evt)
      break
  }
  
  return ok
}


Nav.prototype.handleMouseWheel = function(evt) {
  var type = evt.type
  var wheelEvent = evt.oldEvent
  wheelEvent.preventDefault()
  
  var anchor = [evt.mapX, evt.mapY]
  
  var map = this.map
  
  var delta = 0
  if (type == EventTag.wheel) {
    delta = wheelEvent.deltaY
  } else if (type == EventTag.mouseWheel) {
    delta = - wheelEvent.wheelDeltaY
  }
  
  if (delta === 0) {
    return
  }

  var currentLev = map.getLevel(map.level)
  var currentCenter = map.center
  var newLev

  // 放大为正
  if (delta > 0) {
    map.setLevel(-1)
  }
  // 缩小为负
  else {
    map.setLevel(1)
  }
  
  newLev = map.getLevel(map.level)

  var x = anchor[0] - newLev * (anchor[0] - currentCenter[0]) / currentLev
  var y = anchor[1] - newLev * (anchor[1] - currentCenter[1]) / currentLev
  
  map.center = [x, y]
  map.refresh()
}

Nav.prototype.handleMouseDown = function(evt) {
  this.beginNav = true
  
}

Nav.prototype.handleMouseMove = function(evt) {
  if (!this.beginNav) {
    return false
  }
  
  var movePt = [evt.oldEvent.clientX, evt.oldEvent.clientY]
  
  if (this._lastPt) {
    var map = this.map,
      lev = map.getLevel(map.level),
      center = map.center
  
    var dx = this._lastPt[0] - movePt[0],
        dy = this._lastPt[1] - movePt[1]
  
    var tempCenter = [dx, dy]
    tempCenter[0] *= lev
    tempCenter[1] *= lev
  
    tempCenter[0] += center[0]
    tempCenter[1] += center[1]
  
    map.center = tempCenter
    map.refresh()
  }
  
  this.onNaving = true
  this._lastPt = movePt
  
  return true
}

Nav.prototype.handleMouseUp = function(evt) {
  this.beginNav = false
  this._lastPt = null
  
  if (this.onNaving) {
    this.onNaving = false
    return false
  }
  
  return true
}


Nav.prototype.setMap = function (map) {
  this.map = map
}