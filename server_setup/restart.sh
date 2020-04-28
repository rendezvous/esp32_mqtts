#!/bin/bash

sudo systemctl stop mosquitto.service
sudo cat mosquitto.conf > /etc/mosquitto/mosquitto.conf
sudo rm -rf cli_*
sudo systemctl start mosquitto.service
