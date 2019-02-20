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

try {
  const gpsListener = new gpsd.Listener({
    port: 2947,
    hostname: 'localhost',
    logger: {
      info: function() {},
      warn: console.warn,
      error: console.error
    },
    parse: true
  });

  gpsListener.connect(() => {
    logger.info('GPS Listener connected');

    gpsListener.watch();

    gpsListener.on('TPV', (e) => {

      // Update local object on new GPS data.
      logger.info('GPS event:', e);

      mqttClient.publish('gps-data', JSON.stringify(e));

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
  console.log('MQTT Client Connected');
});

// When a message is received, assign the data to the state object.
// mqttClient.on('message', (topic, messageBuffer) => {
//
//   var message = JSON.parse(messageBuffer.toString());
//
//   switch (message.type){
//     case 'clinometer':
//       state.clinometer = message.data;
//       break;
//     default:
//       logger.info(`unrecognized sensor type: ${message.type}`)
//   }
// });

// Set up connection to AWS IoT Core
// const device = deviceModule({
//   keyPath: config.iot.keyPath,
//   certPath: config.iot.certPath,
//   caPath: config.iot.caPath,
//   region: config.aws.region,
//   host: config.iot.host
// });
//
// // Publish a message to initialize trip in database
// logger.info(`Initializing trip: ${state.tripId}`)
// device.publish(config.iot.topicFilters.tripStart, JSON.stringify(state));
//
// // Publish to IoT service on an interval
// setInterval(publishToIot, config.iot.interval * 1000);
//
// function publishToIot() {
//   let event = JSON.stringify(state);
//   logger.info('publishing to IoT');
//   logger.info(event);
//   device.publish(config.iot.topicFilters.tripData, event);
// }
