
/**
 * 点击后生成json格式数据
 */
$('#saveBtn').click(function(e){
  var geos = dataCollection.geos
  var resultJson = data.serialize(geos)
  var resultStr = JSON.stringify(resultJson)
  console.log(resultStr)
})

/**
 * 点击编辑按钮，找到图形，并高亮，等待delete删除
 */
$("#editBtn").click(function(e){
  // 关闭绘制工具
  paint.active = false
  
  // 监听点击，并寻找与点碰撞的图形
  var mapDom = workMap.mapDom
  $(mapDom).mousedown(function(e){
    workMap.flushLightedGeo()
    currentSelectedGeo = null
  
    var mapEvent = workMap.coordinateMapping(e)
    var findGeo = workMap.findPolygonByClickPoint([mapEvent.mapX, mapEvent.mapY])
  
    // 高亮显示
    if (findGeo) {
      findGeo.light = true
      currentSelectedGeo = findGeo
    }
  
    workMap.refresh()
  })
})

$(window).keyup(function(evt) {
  var keyCode = evt.keyCode
  // delete删除键
  if (keyCode === 46) {
    if (currentSelectedGeo) {
      workMap.deletePolygonById(currentSelectedGeo.id)
      workMap.refresh()
    }
  }
  
  evt.preventDefault()
  
})

function resizeCanvas() {
  var width = $(window).get(0).innerWidth - 50,
      height = $(window).get(0).innerHeight - 100
  
  $("#workMap").css({"width":width + 'px',"height" : height + "px"})
  $("#can").attr("width", width)
  $("#can").attr("height", height)
}