
var currentSelectedGeo = null,// 当前点击选中的图形
    workMap = null,
    dataCollection = null,
    paint = null,
    nav = null,
    paintMark = null
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
   * 底图放大、缩小、拖动工具
   * @type {Nav}
   */
  nav = new Nav()
  nav.active = true
  
  /**
   * 考生绘制点工具
   * 当前次绘制会替换上次绘制
   * @type {PaintMark}
   */
  paintMark = new PaintMark(workMap)
  
  workMap.addTools([nav, image, paintMark])
  
  /**
   * 数据处理工具
   * @type {Data}
   */
  data = new Data()
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


$("#nextBtn").click(function(e){
  var mark = paintMark.mark
  
  var result = workMap.findPolygonByClickPoint([mark.x, mark.y])
  if (result === null) {
    alert("答题错误")
  } else {
    alert("答题正确")
  }
})



