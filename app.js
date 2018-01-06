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

daemon.start(() => {
  console.log('GPS Daemon started');
  
  listener.connect(() => {
    console.log('GPS Listener connected');
  
    listener.watch();

    listener.on('TPV', (e) => {
      console.log('event:', e);
    
      device.publish('gps', JSON.stringify(e));

    });

  });
});
