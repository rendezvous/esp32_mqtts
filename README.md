# esp32-mqtts


Tested on Ubuntu 18.04.3 LTS

**Instructions for setting up a Mosquitto server in your machine:**

```
sudo apt update
sudo apt install -y mosquitto mosquitto-clients
```
Make mosquitto.service start automatically on boot up

```sudo systemctl enable mosquitto.service```

Test your installation by checking the installed version

```mosquitto -v```





**Instructions for generating server and CA certificates:**


1- openssl req -new -x509 -days 365 -extensions v3_ca -keyout ca.key -out ca.crt #CA cert + key generation

2- openssl genrsa -out server.key 2048 #server key generation

3- openssl req -out server.csr -key server.key -new #certificate signature request generation

4- openssl x509 -req -in server.csr -CA ca.crt -CAkey ca.key -CAcreateserial -out server.crt -days 180 #certificate signature by AC

5- Move the CA certificate and key to /etc/mosquitto/ca_certificates

6- Move the server certificate and key to /etc/mosquitto/certs



Your mosquitto.conf file should look like this:

```
pid_file /var/run/mosquitto.pid

persistence true
persistence_location /var/lib/mosquitto/

log_dest file /var/log/mosquitto/mosquitto.log

include_dir /etc/mosquitto/conf.d

listener 1883

listener 8883
cafile /etc/mosquitto/ca_certificates/ca.crt
certfile /etc/mosquitto/certs/server.crt
keyfile /etc/mosquitto/certs/server.key

```

**Testing your Mosquitto server:** https://randomnerdtutorials.com/testing-mosquitto-broker-and-client-on-raspbbery-pi/

If you have an active firewall you'll need to allow connections to the ports used by mqtt
