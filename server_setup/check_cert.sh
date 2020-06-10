#!/bin/bash

cd /etc/mosquitto/certs
expiration_date=$(openssl x509 -text -noout -in server.crt | grep "Not After")
expiration_epoch=$(date -d "${expiration_date//Not After : /}" +"%s")

current_date=$(date)
current_epoch=$(date -d "$currentdate" +"%s")

seconds_left=$(( $expiration_epoch - $current_epoch ))
days_left=$(( $seconds_left / ( 3600 * 24 )))



if [ $days_left -lt 8 ]
then
	rm server*
	openssl genrsa -out server.key 2048; #server key generation
	openssl req -out server.csr -key server.key -new "/C=ES/ST=Palma/L=test/O=Global Security/OU=IT Department/CN=192.168.1.40"; #certificate signature request generation
	openssl x509 -req -in server.csr -CA /etc/mosquitto/ca_certificates/ca.crt -CAkey /etc/mosquitto/ca_certificates/ca.key -CAcreateserial -out server.crt -passin pass:1234 -days 45; #certificate signature
	
	cd /etc/mosquitto/cron
	if [[ ! -d cert_log ]]
	then
		mkdir cert_log
	fi
	cd cert_log
	echo "[$current_date]:" "(RENEWAL) The server certificate was renewed" >> certificate_renewal.log

	sudo systemctl restart mosquitto
else
	cd /etc/mosquitto/cron
	if [[ ! -d cert_log ]]
	then
		mkdir cert_log
	fi
	cd cert_log
	echo "[$current_date]:" "The server certificate was not renewed. "$days_left" days left until its expiration date" >> certificate_renewal.log
fi
