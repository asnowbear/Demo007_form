
var currentSelectedGeo = null,// 当前点击选中的图形
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
  popup = new Popup(workMap)
}

/**
 * 绘制完毕
 * @param e
 */
function drawEnd (e) {
  popup.show()
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



