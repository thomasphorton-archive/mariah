const config = require('./config.js');
const uuidv4 = require('uuid/v4');
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

let state = {
  tripId: uuidv4(),
  ts: new Date().getTime()
};

// initialize trip in database
device.publish('trip-start', JSON.stringify(state));

listener.connect(() => {
  logger.info('GPS Listener connected');

  listener.watch();

  listener.on('TPV', (e) => {

    // Update local object on new GPS data.
    logger.info('GPS event:', e);

    if (e.lat != undefined) {
      state.lat = e.lat.toFixed(5);
    }

    if (e.lon != undefined) {
      state.lon = e.lon.toFixed(5);
    }

    state.alt = e.alt;

    if (e.track != undefined) {
      state.track = e.track.toFixed(2);
    }

    if (e.speed != undefined) {
      state.speed = e.speed.toFixed(2);
    }

    state.ts = new Date().getTime();
  });
});

// Publish to IoT service on an interval
setInterval(publishToIot, config.iot.interval * 1000);

function publishToIot() {

  let event = JSON.stringify(state);
  logger.info('publishing to IoT');
  logger.info(event);
  device.publish('trip-data', event);
}
