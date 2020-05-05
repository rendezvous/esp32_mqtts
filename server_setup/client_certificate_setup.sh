#!/bin/bash

echo "$(tput setaf 2)Setting up client certificates $(tput init)"

sudo cp client_check.sh /etc/mosquitto/cron
chmod +x /etc/mosquitto/cron/client_check.sh
sudo mkdir /etc/mosquitto/clients
cd /etc/mosquitto/clients

while true; do
    read -p "$(tput setaf 2)Introduce the number of clients in your system: $(tput init)" clients
    case $clients in
        [1-9] ) 
		host=$(hostname -I)
		for ((n=0;n<clients;n++))
		do
			#create directory structure for each client
			cliName="cli_"$n
			mkdir $cliName
			cd $cliName
			echo "$(tput setaf 2)Generating client key $(tput init)";
			sudo openssl genrsa -out client.key 2048; #client key generation
			echo "$(tput setaf 2)Requesting certificate signature to the CA $(tput init)";
			printf 'ES\n\n\n\n\nclient'$n'\n\n\n\n' | sudo openssl req -out client.csr -key client.key -new; #certificate signature request generation
			echo "$(tput setaf 2)CA signing server certificate $(tput init)";
			sudo openssl x509 -req -in client.csr -CA /etc/mosquitto/ca_certificates/ca.crt -CAkey /etc/mosquitto/ca_certificates/ca.key -CAcreateserial -out client.crt --passin pass:1234 -days 15; #certificate signature by CA
			cd ..
			certTopic="cl/"$cliName
			keyTopic="k/"$cliName
			mosquitto_pub -d -h $host --cafile /etc/mosquitto/ca_certificates/ca.crt -t $certTopic -f $cliName/client.crt -p 8883
			
   			echo "$cliName certificate published"
			mosquitto_sub -d -h $host --cafile /etc/mosquitto/ca_certificates/ca.crt -C 1 -t com/$cliName -p 8883
			
			sleep 1
			mosquitto_pub -d -h $host --cafile /etc/mosquitto/ca_certificates/ca.crt -t $keyTopic -f $cliName/client.key -p 8883
			

			mosquitto_sub -d -h $host --cafile /etc/mosquitto/ca_certificates/ca.crt -C 1 -t com/$cliName -p 8883
		done
		
		sudo systemctl stop mosquitto.service
		sudo echo "require_certificate true" >> /etc/mosquitto/mosquitto.conf
		
		sleep 1
		sudo systemctl start mosquitto.service

		echo "$(tput setaf 2)Adding new cron job for the automatic server certificate renewal  $(tput init)";
		sudo crontab -l > cron_temp
		echo '40 3 * * * sudo /etc/mosquitto/cron/client_check.sh' >> cron_temp
		sudo crontab cron_temp
		rm cron_temp
		echo "$(tput setaf 2)CONFIG DONE! $(tput init)";
		break;;
        
        * ) echo "Please enter an integer number between 1 and 9.";;
    esac
done
