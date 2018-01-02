/**
 *
 * @constructor
 */
function Popup (map, opt) {
  this.map = map
  this.$popupDiv = $('#popupDiv')
  
  this.calculateFixedPosition()
  this.bindEvents()
  this.hide()
  this.stopDefaultEvents()
  this.onSubmitEnd = opt.onSubmitEnd ? opt.onSubmitEnd : function () {}
  this.onCancelEnd = opt.onCancelEnd ? opt.onCancelEnd : function () {}
}

Popup.prototype.stopDefaultEvents = function () {
  var dom = document.getElementById("popupDiv")
  
  for (var key in EventTag) {
    dom.addEventListener(EventTag[key], function(evt){
      evt.stopPropagation()
    })
  }
}

Popup.prototype.bindEvents = function () {
  var submitFn = this.submit.bind(this)
  // 保存按钮监听
  $("#submitBtn").click(function(){
    submitFn()
  })
  
  var cancelFn = this.cancel.bind(this)
  // 取消按钮监听
  $("#cancelBtn").click(function(){
    cancelFn()
  })
  
  $("input:radio[name='menu']").click(function(e){
    if( this.value === 'car') {
      $("#carContentDiv").show()
    } else {
      $("#carContentDiv").hide()
    }
  })
}

Popup.prototype.submit = function() {
  var sel = $("input[name='menu']:checked").val()
  if (!sel) {
    alert("请选择类型！")
    return
  }
  
  var pro = {
    type: sel
  }
  
  if (sel === 'car') {
    var subSel = $("input[name='submenu']:checked").val()
    if (!subSel) {
      alert("请选择子类型！")
      return
    }
    pro.subType = subSel
  }
  
  this.onSubmitEnd(pro)
}

Popup.prototype.cancel = function() {
  this.hide()
}

Popup.prototype.reset = function () {
  $("input:radio[name='menu']").attr("checked", false)
  $("input:radio[name='submenu']").attr("checked", false)
  
  $("#carContentDiv").show()
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
  if (model === null) {
    return
  }
  
  var type = model.type,
      subType = model.subType
  
  if (type === null) {
    return
  }
  
  $("#carContentDiv").hide()
  $(":radio[name='menu'][value='" + type + "']").prop("checked", "checked")
  
  if (type === 'car') {
    $(":radio[name='submenu'][value='" + subType + "']").prop("checked", "checked")
    $("#carContentDiv").show()
  }
}

Popup.prototype.show = function () {
  this.reset()
  this.$popupDiv.show()
}

Popup.prototype.hide = function () {
  this.$popupDiv.hide()
}