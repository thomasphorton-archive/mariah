const config = require('./config.js');

const gpsd = require('node-gpsd');
const deviceModule = require('aws-iot-device-sdk').device;

const daemon = new gpsd.Daemon({
  program: 'gpsd',
  device: '/dev/ttyUSB0',
  port: 2947,
  pid: '/tmp/gpsd.pid',
  readOnly: false,
  logger: {
    info: function() {},
    warn: console.warn,
    error: console.error
  }
});

const listener = new gpsd.Listener({
  port: 2947,
  hostname: 'localhost',
  logger: {
    info: function() {},
    warn: console.lwarn,
    error: console.error
  },
  parse: true
});

const device = deviceModule({
  keyPath: config.iot.keyPath,
  certPath: config.iot.certPath,
  caPath: config.iot.caPath,
  region: config.aws.region,
  host: config.iot.host
});

let mariah = {
  trip_id: 'trip_1';
}

daemon.start(() => {
  console.log('GPS Daemon started');
  
  listener.connect(() => {
    console.log('GPS Listener connected');
  
    listener.watch();

    listener.on('TPV', (e) => {

      // Update local object on new GPS data.
      console.log('event:', e);
      mariah.time = event.time;
      mariah.alt = event.alt;
      mariah.lat = event.lat;
      mariah.lon = event.lon;
    });
  });
});

// Publish to IoT service on an interval
setInterval(publishToIot, config.iot.interval * 1000);

function publishToIot() {
  device.publish('gps', JSON.stringify(mariah));
}
