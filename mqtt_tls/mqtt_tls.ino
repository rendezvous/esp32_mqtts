#include </home/jamengual/Desktop/UIB/TFG/mqtt/client_certificates/mqtt_tls/src/dependencies/WiFiClientSecure/WiFiClientSecure.h>
//#include <WiFiClientSecure.h> //this is the last version on github, but it doesn't work
#include </home/jamengual/Desktop/UIB/TFG/mqtt/client_certificates/mqtt_tls/src/dependencies/PubSubClient/PubSubClient.h>


const char* ssid     = "";     // your network SSID (name of wifi network)
const char* password = ""; // your network password

const char*  server = "192.168.1.43";  


//place your CA certificate here
const char* test_root_ca= \
     "-----BEGIN CERTIFICATE-----\n" \
"MIIDuzCCAqOgAwIBAgIUaZJGxv2WCJWCKju7raZiBwpANrMwDQYJKoZIhvcNAQEL\n" \
"BQAwbTELMAkGA1UEBhMCQVUxEjAQBgNVBAgMCWVzcGHDg8KxYTEOMAwGA1UEBwwF\n" \
"cGFsbWExITAfBgNVBAoMGEludGVybmV0IFdpZGdpdHMgUHR5IEx0ZDEXMBUGA1UE\n" \
"AwwOamFtZW5ndWFsLVg1NUMwHhcNMjAwMTI5MTkzMTE1WhcNMjUwMTI4MTkzMTE1\n" \
"WjBtMQswCQYDVQQGEwJBVTESMBAGA1UECAwJZXNwYcODwrFhMQ4wDAYDVQQHDAVw\n" \
"YWxtYTEhMB8GA1UECgwYSW50ZXJuZXQgV2lkZ2l0cyBQdHkgTHRkMRcwFQYDVQQD\n" \
"DA5qYW1lbmd1YWwtWDU1QzCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEB\n" \
"AMkk2x+BvjK9FaJRsPH6kiC9qKFBt98NTI4ZRvYWL/rv9wXaAyfAObVgE0+r99cE\n" \
"JEQXMc7ZuAdBRf77t42nX+ZZQQpwrBkyZOo006332HMfNqcySI6kthxEvDqxB0sh\n" \
"MDbewEFK/k5O2pboPD7zto8vNBO8dI4zOp79mktRD0a1+dT+hsSkulFgszcQxyLv\n" \
"vXirqD81Q8a+c7/cnuVJ+MgL2B3KCEUyYXm3LIpXJypefBk0ADWYQj+SXfBR7h0u\n" \
"8+lpdemjcE9FqM7r3gOKUTcfLmTOM3YbYuWnYCPBO5M9bNoTAfmlpplOc1yoQfJt\n" \
"p8StCYg3uDsb98qf/+eg9g8CAwEAAaNTMFEwHQYDVR0OBBYEFJ4u13INmOhJS1OT\n" \
"gjY4hzEwZP8aMB8GA1UdIwQYMBaAFJ4u13INmOhJS1OTgjY4hzEwZP8aMA8GA1Ud\n" \
"EwEB/wQFMAMBAf8wDQYJKoZIhvcNAQELBQADggEBACGAuqsQQxc2hB2hmFWPSTyE\n" \
"vGTp4Z4zJDxM8bXrio0rQyogyvWFoApfhJwlDOhubHTJfvhV3Y6WW+wyN5rn1gyX\n" \
"MEOQXpMenlpI8oe4xKV/hFW0o8bJY3pp8P3XgLkVUA3o1PdGC2mYf7Irfa5XRszp\n" \
"e1k5PLCYkyRxQoV9fQHxu3gje1sTce3dZpLh4ybKL6iC8x0t576Pic+IeNC4SGM6\n" \
"OTydu6zDPWutp28PXYqf7P14H4VwQOulfKxFmbiHZJONYAqjtlcAFHVU64pXYN6j\n" \
"5lA67uCiCjc58Qxts/Crxe8wc0oEisig/ifP0dc3SW4LnMgB2u/ljHewVA/jWW4=\n" \ 
"-----END CERTIFICATE-----\n";

// You can use x.509 client certificates if you want
char* test_client_cert = "";  //to verify the client

char* test_client_key = "";   //to verify the client

byte myPayloadCert [2048];
byte myPayloadKey [2048];
char macAddress [48];

WiFiClientSecure espClient;
PubSubClient client(espClient);
const int led = 2;

#define LED_TOPIC     "esp32/led" /* 1=on, 0=off */
#define CERT_TOPIC    "cl/cli_0"
#define COM_TOPIC    "com/cli_0"
#define KEY_TOPIC    "k/cli_0"

void setup() {
  //Initialize serial and wait for port to open:
  Serial.begin(115200);
  delay(100);
  /* set led as output to control led on-off */
  pinMode(led, OUTPUT);
  /* Loop until reconnected */

  connectWiFi();

  mqttconnect(false);
}

void connectWiFi(){
  Serial.print("Attempting to connect to SSID: ");
  Serial.println(ssid);
  WiFi.begin(ssid, password);

  // attempt to connect to Wifi network:
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    // wait 1 second for re-trying
    delay(1000);
  }

  Serial.print("Connected to ");
  Serial.println(ssid);
}

void receivedCallback(char* topic, byte* payload, unsigned int length) {
  Serial.print("Message received: ");
  Serial.println(topic);
  payload[length]='\0';
  if(strcmp(topic, LED_TOPIC) == 0 ) {
      
      /* we got '1' -> on */
      if ((char)payload[0] == '1') {
        Serial.print("uno");
        digitalWrite(led, HIGH); 
      } else {
        Serial.print("cero");
          /* we got '0' -> off */
        digitalWrite(led, LOW);
      }  
  }
  if (strcmp(topic, CERT_TOPIC)==0){
     memcpy(myPayloadCert, payload, length);
     //test_client_cert = (char*)payload; 
     Serial.println(test_client_cert);
     delay(200);
     client.publish(COM_TOPIC, "1");
      
  }

  if (strcmp(topic, KEY_TOPIC)==0){
     memcpy(myPayloadKey, payload, length);
     delay(200);
     WiFi.macAddress().toCharArray(macAddress, 48);
     client.publish(COM_TOPIC, macAddress);
    //espClient.stop();
    delay(500);
     
   

     mqttconnect(true);
      
  }
  

}

void mqttconnect(boolean certi) {

  espClient.setCACert(test_root_ca); 
  if(certi){
      Serial.println("SETTING UP CLIENT");
      //Serial.println(test_client_cert);
     test_client_cert = (char*)myPayloadCert;
     test_client_key = (char*)myPayloadKey;
     espClient.setCertificate(test_client_cert);
     espClient.setPrivateKey(test_client_key);
     Serial.println("INFO CLIENT");
     Serial.println(espClient.getCert());
     Serial.println("**********************");
  Serial.println(espClient.getPrivateKey());     
  }
 
   
  //client.setCertificate(test_client_key); // for client verification
  //client.setPrivateKey(test_client_cert);  // for client verification

  /*
   * Connection via connect function (WiFiClientSecure)
   * Inside the connect function there's a call to another function in the ssl_client library, where the tls/ssl connection is set up
   */
  Serial.println("\nStarting connection to server...");
  while(!espClient.connect(server, 8883)){
    if (!espClient.connect(server, 8883)){
    Serial.println("Connection failed!");
    delay(5000);
  }else {
    Serial.println("Connected to server!");
  }
  }
  /*if (!espClient.connect(server, 8883))
    Serial.println("Connection failed!");
  else {
    Serial.println("Connected to server!");
  }*/
  //client.setServer(server, 8883); //connection via Pubsubclient lib

  client.setCallback(receivedCallback);
  while (!client.connected()) {
    Serial.print("MQTT connecting ...");
    /* client ID */
    String clientId = "ESP32Client_test";
    /* connect now */
    if (client.connect(clientId.c_str())) {
      Serial.println("connected");
      /* subscribe topic */
      client.subscribe(LED_TOPIC);
      if(client.subscribe(CERT_TOPIC)){
        Serial.println("funciona sub");
      } else {
        Serial.println("no sub");
      }
      client.subscribe(KEY_TOPIC);
    } else {
      Serial.print("failed, status code =");
      Serial.print(client.state());
      Serial.println("try again in 5 seconds");
      /* Wait 5 seconds before retrying */
      delay(5000);
    }
  }
}



int counter = 0;
long lastMsg = 0;
char msg[20];


void loop() {
  /* if client was disconnected then try to reconnect again */
  if(WiFi.status() != WL_CONNECTED){
    connectWiFi();
  }
  
  if (!client.connected()) {
    mqttconnect(true);
  }
  /* this function will listen for incomming 
  subscribed topic-process-invoke receivedCallback */
  client.loop();

   /* we increase counter every 3 secs
  we count until 3 secs reached to avoid blocking program if using delay()*/
  long now = millis();
  if (now - lastMsg > 3000) {
    lastMsg = now;
    if (counter < 100) {
      counter++;
      snprintf (msg, 20, "%d", counter);
      /* publish the message */
      client.publish("esp32/pub", msg);
    }else {
      counter = 0;  
    }
  }
  
}
