
/**
 *
 * @constructor
 */
function Data() {
  
}

Data.prototype.serialize = function(dataCollection) {
  var features = []
  
  dataCollection.forEach(function(geo) {
    var jsonObj = {
      type: 'Feature',
      geometry : {
        type: 'polygon',
        coordinates: geo.getPosition()
      },
      properties: geo.feature
    }
  
    features.push(jsonObj)
  })
  
  var geoJson = {
    type: 'FeatureCollection',
    features: features
  }
  
  return geoJson
}

Data.prototype.deserialize = function(jsonStr) {
  
}

