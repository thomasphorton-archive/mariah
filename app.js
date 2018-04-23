const config = require('./config.js');

const gpsd = require('node-gpsd');
const deviceModule = require('aws-iot-device-sdk').device;
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

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
    warn: console.warn,
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
  trip_id: 'whistler'
}

daemon.start(() => {
  logger.info('GPS Daemon started');
  
  listener.connect(() => {
    logger.info('GPS Listener connected');
  
    listener.watch();

    listener.on('TPV', (e) => {

      // Update local object on new GPS data.
      logger.info('GPS event:', e);
      mariah.time = e.time;
      mariah.alt = e.alt;
      mariah.lat = e.lat;
      mariah.lon = e.lon;
    });
  });
});

// Publish to IoT service on an interval
setInterval(publishToIot, config.iot.interval * 1000);

function publishToIot() {
  let event = JSON.stringify(mariah);
  logger.info('publishing to IoT');
  logger.info(event);
  device.publish('gps', event);
}
