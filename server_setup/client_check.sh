#!/bin/bash


current_date=$(date)
current_epoch=$(date -d "$currentdate" +"%s")

host=$(hostname)

		for ((n=0;n<9;n++))
		do
			if [[ -d "cli_"$n ]]
			then
				cliName="cli_"$n
				cd $cliName
				expiration_date=$(openssl x509 -text -noout -in client.crt | grep "Not After")
				expiration_epoch=$(date -d "${expiration_date//Not After : /}" +"%s")

				seconds_left=$(( $expiration_epoch - $current_epoch ))
				days_left=$(( $seconds_left / ( 3600 * 24 )))
				
				if [ $days_left -lt 5 ]
				then
					rm client*
					echo "$(tput setaf 2)Generating client key $(tput init)";
					sudo openssl genrsa -out client.key 2048; #server key generation #no expect
					echo "$(tput setaf 2)Requesting certificate signature to the CA $(tput init)";
					printf 'ES\n\n\n\n\nclient'$n'\n\n\n\n' | sudo openssl req -out client.csr -key client.key -new; #certificate signature request generation
					echo "$(tput setaf 2)CA signing server certificate $(tput init)";
					sudo openssl x509 -req -in client.csr -CA /etc/mosquitto/ca_certificates/ca.crt -CAkey /etc/mosquitto/ca_certificates/ca.key -CAcreateserial -out client.crt --passin pass:1234 -days 15; #certificate signature
					cd ..
					echo "$(tput setaf 2)Publishing certificate and key... $(tput init)";
					certTopic="cl/"$cliName
					keyTopic="k/"$cliName
					comTopic="com/"$cliName
					sudo mosquitto_pub -d -h $host --cafile /etc/mosquitto/ca_certificates/ca.crt -t $certTopic -f $cliName/client.crt -p 8883 --cert $cliName/client.crt --key $cliName/client.key
			
   					echo "$cliName certificate published"
					sudo mosquitto_sub -d -h $host --cafile /etc/mosquitto/ca_certificates/ca.crt -C 1 -t $comTopic -p 8883 --cert $cliName/client.crt --key $cliName/client.key
			
					sleep 1
					sudo mosquitto_pub -d -h $host --cafile /etc/mosquitto/ca_certificates/ca.crt -t $keyTopic -f $cliName/client.key -p 8883 --cert $cliName/client.crt --key $cliName/client.key
			

					sudo mosquitto_sub -d -h $host --cafile /etc/mosquitto/ca_certificates/ca.crt -C 1 -t $comTopic -p 8883 --cert $cliName/client.crt --key $cliName/client.key

					cd /etc/mosquitto
					if [[ ! -d cert_log ]]
					then
						mkdir client_cert_log
					fi
					cd client_cert_log
					sudo echo "[$current_date]:" "(RENEWAL) Client $n certificate was renewed" >> client_certificate_renewal.log

					sudo systemctl restart mosquitto
				else
					cd /etc/mosquitto
					if [[ ! -d cert_log ]]
					then
						mkdir client_cert_log
					fi
					cd client_cert_log
					sudo echo "[$current_date]:" "(RENEWAL) Client $n certificate was renewed" >> client_certificate_renewal.log
					sudo echo "[$current_date]:" "Client $n certificate was not renewed. "$days_left" days left until its expiration date" >> client_certificate_renewal.log
				fi
				
				
			else 
				break;

			fi
		done


