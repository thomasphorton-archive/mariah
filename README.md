# Mariah
## What is it?
mariah is a thing that sits on your boat and reads data from sensors. it runs a local application that displays the data in interesting ways.

future versions will include a cloud-hosted application

## Hardware
1. [Raspberry Pi](http://amzn.to/2CZ7Lzy)
1. [Adafruit Ultimate GPS Breakout](http://amzn.to/2CuXCcF)
1. [USB to TTL Cable](http://amzn.to/2CYqrzh)

### Optional
1. [Expansion Board](http://amzn.to/2COXpoP)
1. [Breadboard](http://amzn.to/2CI313j)

## Setup
1. `npm install`
1. `node app`

## Cloud Setup
### IoT Setup
1. Generate an IoT cert with the one-click certification creation.
1. Move certs to `/certs`
1. Update `/config.js` to match cert locations

### IoT Rules
1. Configure IoT Rules logging
	* Create IAM Role
	* Turn on logging in the IoT Rules settings pane
1. Create a bucket in the same region as your device
1. Create a rule
	* Attribute: `*`
	* Topic filter: `gps`
	* Condition: leave blank
1. Add action (Store messages in Amazon S3 bucket)
	* S3 bucket: use the bucket created earlier
	* Key: `${topic()}/${timestamp()}`
	* Create a new role to grant IoT access

## Testing
This library relies on connection to a GPSD server to receive data. Use the `gpsd-fake` library to create a local GPSD server. By default, it should be broadcasting on the correct ports and there will be no additional configuration needed.
