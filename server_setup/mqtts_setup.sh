#!/bin/bash

echo "$(tput setaf 2)Installing mosquitto and mosquitto-clients $(tput init)"

#raspberry pi4 installation commands (raspbian)
sudo wget http://repo.mosquitto.org/debian/mosquitto-repo.gpg.key
sudo apt-key add mosquitto-repo.gpg.key
sudo wget http://repo.mosquitto.org/debian/mosquitto-stretch.list -P /etc/apt/sources.list.d/
sudo apt-get update
sudo apt-get install mosquitto mosquitto-clients

while true; do
    read -p "$(tput setaf 2)Do you have a public domain name for this server? (Y)es/(N)o:$(tput init)" yn
    case $yn in
        [Yy]* ) 
		echo "$(tput setaf 2)Adding certbot repository $(tput init)";
		sudo add-apt-repository ppa:certbot/certbot;

		echo "$(tput setaf 2)Updating the package list $(tput init)";
		sudo apt-get update;
		echo "$(tput setaf 2)Installing certbot $(tput init)";
		sudo apt-get install certbot;

		echo "$(tput setaf 2)Allowing connections to port 80 before getting your certificates $(tput init)";
		sudo ufw allow http;

		echo "$(tput setaf 2)Getting your certificate via certbot $(tput init)";
		sudo certbot certonly --standalone --preferred-challenges http-01;  #--standalone-supported-challenges is deprecated

		sudo crontab -l > cron_temp
		echo '30 3 * * * certbot renew --noninteractive --post-hook "systemctl restart mosquitto"' >> cron_temp
		sudo crontab cron_temp
		sudo rm cron_temp

		echo "$(tput setaf 2)Updating your mosquitto configuration file  $(tput init)";
		sudo cat mosquitto.conf > /etc/mosquitto/mosquitto.conf
		sudo systemctl restart mosquitto.service

		break;;
        [Nn]* ) 
		echo "$(tput setaf 2)First create a key pair for the CA $(tput init)";
		sudo openssl genrsa -des3 --passout pass:1234 -out ca.key 2048
		echo "$(tput setaf 2)Generating CA certificate and key $(tput init)";
		host=$(hostname)
		printf 'ES\nCA\n\n\n\n'$host'\n\n\n\n' | sudo openssl req -new -x509 -days 1826 -key ca.key -out ca.crt --passin pass:1234
		#openssl req -new -x509 -days 365 -extensions v3_ca -keyout ca.key -out ca.crt; #CA cert + key generation 
		echo "$(tput setaf 2)Generating server key $(tput init)";
		sudo openssl genrsa -out server.key 2048; #server key generation
		echo "$(tput setaf 2)Requesting certificate signature to the CA $(tput init)";
		sudo openssl req -out server.csr -key server.key -new -subj "/C=ES/ST=Palma/L=test/O=Global Security/OU=IT Department/CN=192.168.1.40"; #certificate signature request generation
		echo "$(tput setaf 2)CA signing server certificate $(tput init)";
		sudo openssl x509 -req -in server.csr -CA ca.crt -CAkey ca.key -CAcreateserial -out server.crt -passin pass:1234 -days 45; #certificate signature by CA
		echo "$(tput setaf 2)Moving the CA certificate and key to /etc/mosquitto/ca_certificates  $(tput init)";
		sudo mv ca.crt ca.key /etc/mosquitto/ca_certificates
		echo "$(tput setaf 2)Moving the server certificate and key to /etc/mosquitto/certs  $(tput init)";
		sudo mv server.crt server.key /etc/mosquitto/certs
		sudo rm ca.srl server.csr
		sudo mv check_cert.sh /etc/mosquitto/cron
		echo "$(tput setaf 2)Adding new cron job for the automatic server certificate renewal  $(tput init)";
		sudo crontab -l > cron_temp
		echo '30 3 * * * /etc/mosquitto/cron/check_cert' >> cron_temp
		sudo crontab cron_temp
		sudo rm cron_temp

		echo "$(tput setaf 2)Updating your mosquitto configuration file  $(tput init)";
		sudo cat mosquitto.conf > /etc/mosquitto/mosquitto.conf
		sudo cat passwords > /etc/mosquitto/passwdfile
		sudo systemctl restart mosquitto.service

		exit;;
        * ) echo "Please answer yes or no.";;
    esac
done



