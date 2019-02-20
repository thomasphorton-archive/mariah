const mqtt = require('mqtt');
const client = mqtt.connect('ws://localhost:1883');

client.on('connect', () => {
  client.subscribe('sensor-data', (err) => {
    if (!err) {
      client.publish('sensor-data', {

      });
    }
  })
})

client.on('message', (topic, message) => {
  console.log(message.toString());
  client.end();
})
