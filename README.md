# esp32_mqtts

Tested on Ubuntu 18.04.3 LTS

**Instructions:**

Under the folder "server_setup" you'll find two scripts and a mosquitto configuration file.

- ```mqtts_setup.sh``` 

This script will install the official mosquitto server repository to your machine and will ask if you have a public domain name for your server, in that case, the script will install certbot on your system and will get you a server certificate signed by Let's Encrypt (Please note that this part of the script is still under development). 

In case you don't have a public domain name, it will create a self-signed server certificate via OpenSSL. The CA certificate has a validity period of 5 years and the server certificate will last for 45 days.

In both cases, the script will add a new cron job to your server to check your server certificate every day at 3:30am. Lastly, the configuration file will be updated and the mosquitto.service will restart.



- ```check_cert.sh```

This script will check your server certificate's expiration date and will perform a renewal 8 days before that date. Both if the certificate is renewed or not, the script will log a message to a file (/etc/mosquitto/cert_log/certificate_renewal.log) indicating that it checked your certificate and acted accordingly.

Under the folder "mqtt_tls" you'll find a simple example for connecting an ESP32 to your Mosquitto broker. 
The example ```mqtt_tls.ino``` simply connects to port 8883 of your server and subscribes to a topic (esp32/led) that is used to turn on or off the ESP32's led, it also publishes a counter value to the topic esp32/pub.

**How to test the example:**

1- First run "mqtts_setup.sh" and follow the steps. If you use the OpenSSL self-signed option, when you are asked to provide your country, organization name, etc. it is compulsory to use different values for your CA certificate and server certificate, except the CN value, which should be the same as your hostname in both cases.

2- Check if mosquitto.service is running with: ```systemctl status mosquitto.service```

3- If it's not running: ```sudo systemctl start mosquitto.service```

4- Upload the sketch (mqtt_tls.ino) to your ESP32 via Arduino IDE and complete the script with your network parameters. If everything goes fine and you check your serial window, it should indicate that the connection to the mqqt server has been made succesfuly.

5- To turn the LED on, go to a terminal window and paste: ```mosquitto_pub -d -h <hostname> --cafile /etc/mosquitto/ca_certificates/ca.crt -t esp32/led -m "1" -p 8883``` where "hostname" should be the name of your system and the name you've put as your CN in both your CA and server certificates.

6- To check if the ESP32 is publishing correctly to esp32/pub: ```mosquitto_sub -d -h <hostname> --cafile /etc/mosquitto/ca_certificates/ca.crt -t esp32/pub -p 8883```

7- If it's not working please check ```sudo cat /var/log/mosquitto/mosquitto.log```. All the error logs will be there. If you need help, feel free to open a new issue in this respository.
