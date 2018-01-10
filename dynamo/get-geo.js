const AWS = require('aws-sdk');

AWS.config.update({
  region: 'us-west-2'
});

const now = new Date();

let dateString = now.getFullYear() + '-' + now.getMonth() + '-' + (now.getDate() + 1)

const s3 = new AWS.S3();
const docClient = new AWS.DynamoDB.DocumentClient();

let geojson = {
  'id': 'route',
  'type': 'line',
  'source': {
    'type': 'geojson',
    'data': {
      'type': 'Feature',
      'properties': {},
      'geometry': {
        'type': 'LineString',
        'coordinates': []
      }
    }
  },
  "layout": {
      "line-join": "round",
      "line-cap": "round"
  },
  "paint": {
      "line-color": "#888",
      "line-width": 8
  }
}

var params = {
  TableName:  'mariah-gps-data',
  KeyConditionExpression: 'trip_id = :trip_id and #time > :now',
  ExpressionAttributeNames: {
    '#time': 'time',
  },
  ExpressionAttributeValues: {
    ':trip_id': 'trip_1',
    ':now': dateString
  }
}

docClient.query(params, (err, data) => {
  if (err) {
    console.error(JSON.stringify(err, null, 2));
  } else {
    console.log('success');
    let coords = [];
    data.Items.forEach(item => {
      if (item.lon !== undefined && item.lat !== undefined) {
        coords.push([item.lon, item.lat]);
      }
    })

    geojson.source.data.geometry.coordinates = coords;

    var s3params = {
      Body: JSON.stringify(geojson),
      Bucket: 'mariah-us-west-2',
      Key: 'test-data.json'
    }

    s3.putObject(s3params, (err, data) => {
      if (err) console.log(err, err.stack)
      else console.log(data);
    })
  }
})



