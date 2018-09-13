# Mariah

## What is it?
`Mariah` is a hub for your Smart Boat. Sensors will send it data, which will be
collected and emitted to customizable endpoints.

### Data Flow
* Gathers from various sensors and updates a state object
	* GPS
	* Pitch, Roll, Yaw
	* Temp/Humidity (planned)

* Provides an API for accessing state
	* Sockets? MQTT? I'd like a pub-sub model to push data to local clients.

* Optional- sends state object to AWS IoT on an interval
	* 10 seconds for cost considerations
