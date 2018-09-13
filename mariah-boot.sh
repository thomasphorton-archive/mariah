#!/bin/sh
# Starts cell modem and runs Mariah Hub.
# move to `/etc/init.d/` when setting up a new device.

sudo hologram modem connect
sudo node /home/pi/Repos/mariah/app
