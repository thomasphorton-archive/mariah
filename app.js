const config = require('./config.js');

const gpsd = require('node-gpsd');
const deviceModule = require('aws-iot-device-sdk').device;
const winston = require('winston');
const Mariah = require('./mariah');

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

let mariah = new Mariah('trip_2');

listener.connect(() => {
  logger.info('GPS Listener connected');

  listener.watch();

  listener.on('TPV', (e) => {

    // Update local object on new GPS data.
    logger.info('GPS event:', e);

    mariah.updateLocation(e.lat, e.lon, e.alt);
    mariah.updateTime(e.time);
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
