const config = require('./config.js');
const uuidv4 = require('uuid/v4');
const gpsd = require('node-gpsd');
const deviceModule = require('aws-iot-device-sdk').device;

const mqtt = require('mqtt');

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

let state = {
  tripId: uuidv4(),
  ts: new Date().getTime()
};

try {
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
}
catch (err) {
  logger.error('Error starting GPS listener:');
  logger.error(err);
}

logger.info(`Connecting to MQTT server at ${config.mqtt.connectionString}`);
var mqttClient = mqtt.connect(config.mqtt.connectionString);

mqttClient.on('connect', () => {
  let topicName = 'sensor-data';

  mqttClient.subscribe(topicName, (err) => {
    if (!err) {
      logger.info(`subscribed to ${topicName}`);
    }
  });
});

// When a message is received, assign the data to the state object.
mqttClient.on('message', (topic, messageBuffer) => {

  var message = JSON.parse(messageBuffer.toString());

  switch (message.type){
    case 'clinometer':
      state.clinometer = message.data;
      break;
    default:
      logger.info(`unrecognized sensor type: ${message.type}`)
  }
});

// Set up connection to AWS IoT Core
const device = deviceModule({
  keyPath: config.iot.keyPath,
  certPath: config.iot.certPath,
  caPath: config.iot.caPath,
  region: config.aws.region,
  host: config.iot.host
});

// Publish a message to initialize trip in database
logger.info(`Initializing trip: ${state.tripId}`)
device.publish(config.iot.topicFilters.tripStart, JSON.stringify(state));

// Publish to IoT service on an interval
setInterval(publishToIot, config.iot.interval * 1000);

function publishToIot() {
  let event = JSON.stringify(state);
  logger.info('publishing to IoT');
  logger.info(event);
  device.publish(config.iot.topicFilters.tripData, event);
}
