
var currentSelectedGeo = null,// 当前点击选中的图形
  currentGeo = null,
  workMap = null,
  dataCollection = null,
  paint = null,
  nav = null,
  popup = null,
  data = null

/**
 * 初始化地图引擎
 *
 * @param url 底图图片的路径
 * @param datasource 初始数据源，如果没有，则null
 * @param allGeoDisplay 所用图形是否显示
 */
function init (url, datasource, allGeoDisplay) {
  
  resizeCanvas()
  
  /**
   * 初始引擎
   * @type {WrokMap}
   */
  workMap = new WrokMap({
    mapId: 'workMap',
    canvasId: 'can'
  })
  
  dataCollection = {
    name: 'dataCollection',
    geos : []
  }
  
  if (datasource) {
    if (allGeoDisplay === undefined) {
      allGeoDisplay = true
    }
    
    fillData(dataCollection, datasource, allGeoDisplay)
  }
  
  workMap.datasource.push(dataCollection)
  
  /**
   * 图像底图
   * @type {MyImage}
   */
  var image = new MyImage(url)
  
  /**
   * 绘制工具
   * @type {Paint}
   */
  paint = new Paint({
    dataCollection: dataCollection,
    drawEnd: drawEnd,
    drawStart: drawStart
  })
  paint.active = true
  
  /**
   * 底图放大、缩小、拖动工具
   * @type {Nav}
   */
  nav = new Nav()
  nav.active = true
  
  workMap.addTools([nav, image, paint])
  
  /**
   * 数据处理工具
   * @type {Data}
   */
  data = new Data()
  
  /**
   * 初始化表单
   * @type {Popup}
   */
  popup = new Popup(workMap, {onSubmitEnd: onSubmitEnd, onCancelEnd: onCancelEnd})
}

/**
 * 绘制完毕
 * @param e
 */
function drawEnd (e) {
  popup.show()
  currentGeo = e
  paint.active = false
}

/**
 * 表单点击确认执行的回调函数
 * @param data 表单数据
 */
function onSubmitEnd (data) {
  if (data) {
    currentGeo.feature = {
      type: data.type,
      subType: data.subType
    }
  }
  
  popup.hide()
  paint.active = true
}

/**
 * 表单点击取消执行的回调函数
 * @param data
 */
function onCancelEnd () {
  paint.active = true
  if (!currentGeo) {
    return
  }
  
  workMap.deletePolygonById(currentGeo.id)
  workMap.refresh()
}

/**
 * 选择完毕的执行函数
 */
function onSelectedEnd() {
  if (!currentGeo) {
    return
  }
  
  popup.show()
  popup.fillData(currentGeo.feature)
}

/**
 * 绘制完毕
 * @param e
 */
function drawStart (e) {
  popup.hide()
}

function fillData (collection, datasource, allDisplay) {
  var fs = datasource.features
  if (fs) {
    fs.forEach(function(f){
      var geo = new MyPolygon()
      geo.setPosition(f.geometry.coordinates)
      geo.display = allDisplay
      geo.feature = f.properties
      collection.geos.push(geo)
    })
  }
}

function resizeCanvas() {
  var width = $(window).get(0).innerWidth - 50,
    height = $(window).get(0).innerHeight - 100
  
  $("#workMap").css({"width":width + 'px',"height" : height + "px"})
  $("#can").attr("width", width)
  $("#can").attr("height", height)
}

/**
 * 点击后生成json格式数据
 */
$('#saveBtn').click(function(e){
  if (popup.popupShow) {
    alert('正在编辑数据，请点击确认完成！')
    return
  }
  
  var geos = dataCollection.geos
  var resultJson = data.serialize(geos)
  var resultStr = JSON.stringify(resultJson)
  console.log(resultStr)
})

$("#paintBtn").click(function(e){
  if (popup.popupShow) {
    alert('正在编辑数据，请点击确认完成！')
    return
  }
  paint.active = true
  popup.hide()
})

/**
 * 点击编辑按钮，找到图形，并高亮，等待delete删除
 */
$("#editBtn").click(function(e){
  if (popup.popupShow) {
    alert('正在编辑数据，请点击确认完成！')
    return
  }
  
  // 关闭绘制工具
  paint.active = false
  
  // 监听点击，并寻找与点碰撞的图形
  var mapDom = workMap.mapDom
  $(mapDom).mousedown(function(e){
    if (paint.active) {
      return
    }
    
    workMap.flushLightedGeo()
    popup.hide()
    currentGeo = null
    
    var mapEvent = workMap.coordinateMapping(e)
    var findGeo = workMap.findPolygonByClickPoint([mapEvent.mapX, mapEvent.mapY])
    
    // 高亮显示
    if (findGeo) {
      findGeo.light = true
      currentGeo = findGeo
      onSelectedEnd()
    }
    
    workMap.refresh()
  })
})

/**
 * 功能删除
 */
$(window).keyup(function(evt) {
  var keyCode = evt.keyCode
  // delete删除键
  if (keyCode === 46) {
    if (currentGeo) {
      workMap.deletePolygonById(currentGeo.id)
      popup.hide()
      workMap.refresh()
    }
  }
  
  evt.preventDefault()
})



