#!/bin/bash
sudo systemctl stop mosquitto.service
sudo rm /var/lib/mosquitto/mosquitto.db
sudo systemctl start mosquitto.service
