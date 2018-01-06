# Mariah

## Setup

1. Start the GPS daemon: `sudo gpsd /dev/ttyUSB0 -F /var/run/gpsd.sock`
1. Test GPS fix: `cgps -s`

## Teardown

1. Stop GPS daemon: `sudo killall gpsd`