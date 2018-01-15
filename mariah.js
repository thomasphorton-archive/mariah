function Mariah(id) {

  let trip_id = id;
  let time = new Date().getTime();
  let location = {
    x: 0,
    y: 0,
    z: 0
  }

  var updateLocation = function(x, y, z) {
    location.x = x;
    location.y = y;
    location.z = z;

    console.log('location updated:', location);
  }

  var getLocation = function() {
    return {
      x: location.x,
      y: location.y,
      z: location.z
    }
  }

  var getTime = function() {
    return time
  }

  var updateTime = function(t) {
    time = new Date(t).getTime();
  }

  var getTripId = function() {
    return trip_id;
  }

  return {
    getTripId: getTripId,
    getLocation: getLocation,
    updateLocation: updateLocation,
    getTime: getTime,
    updateTime: updateTime
  }
}

module.exports = Mariah;