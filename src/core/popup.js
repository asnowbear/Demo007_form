/**
 *
 * @constructor
 */
function Popup (map) {
  this.map = map
  this.$popupDiv = $('#popupDiv')
  
  this.calculateFixedPosition()
  this.bindEvents()
  this.hide()
}

Popup.prototype.bindEvents = function () {
  var submitFn = this.submit.bind(this)
  // 保存按钮监听
  $("#saveBtn").click(function(){
    submitFn()
  })
  
  var cancelFn = this.cancel.bind(this)
  // 取消按钮监听
  $("#cancelBtn").click(function(){
    cancelFn()
  })
}

Popup.prototype.submit = function() {
  var a = 1
}

Popup.prototype.cancel = function() {
  
}

Popup.prototype.calculateFixedPosition = function () {
  var mapDom = this.map.mapDom
  
  var width = $(mapDom).width(),
      height = $(mapDom).height()
  
  var w = this.$popupDiv.width()
      h = this.$popupDiv.height()
  
  var left = width - w - 10,
      top = height / 2 - h / 2 - 10
  
  this.$popupDiv.css({"left": left + 'px', "top": top + 'px'})
}


Popup.prototype.fillData = function (model) {
  
}

Popup.prototype.show = function () {
  this.$popupDiv.show()
}

Popup.prototype.hide = function () {
  this.$popupDiv.hide()
}