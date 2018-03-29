# Mariah

## What is it?
mariah is a thing that sits on your boat and reads data from sensors. it runs a local application that displays the data in interesting ways.

future versions will include a cloud-hosted application

## Architecture
* draw diagram

## Modules
* gather from various sensors
	* GPS (in progress)
	* Temp/Humidity (in progress)

* record in a local DB
	* run dynamodb locally

* display data on local application
	* node/express for api

* hook up device (display)

* launch the application
	* launch os, click shortcut on desktop?
	* launch application on boot/boot straight to app

## Cloudifying
* authentication with Cognito
* wrap API and stick it in a lambda function
* put API Gateway in front of the lambda

* deploy SPA to s3-hosted website
	* changing references in JS to point to API gateway

## API
/location
GET
returns: location object
retrieves value from state object

PUT
returns: status object
update state object with new value

POST
returns: HTTP response

/temperature
GET

POST

/humidity
GET

POST

## Objects
* location
```
{
	lat: num,
	lon: num,
	t:
}
```

* state object
contains stateful representation of the boat. updates as fast as sensors can take readings.

* database thing
read state object and update database at an interval

* local application
reads from state object and displays
