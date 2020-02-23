#include </home/jamengual/Desktop/UIB/TFG/mqtt/github/mqtt_tls/src/dependencies/WiFiClientSecure/WiFiClientSecure.h>
//#include <WiFiClientSecure.h> //this is the last version on github, but it doesn't work
#include <PubSubClient.h>


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
//const char* test_client_key = "";   //to verify the client
//const char* test_client_cert = "";  //to verify the client


WiFiClientSecure espClient;
PubSubClient client(espClient);
const int led = 2;

#define LED_TOPIC     "esp32/led" /* 1=on, 0=off */

void receivedCallback(char* topic, byte* payload, unsigned int length) {
  Serial.print("Message received: ");
  Serial.println(topic);

  Serial.print("payload: ");
  for (int i = 0; i < length; i++) {
    Serial.print((char)payload[i]);
  }
  Serial.println();
  /* we got '1' -> on */
  if ((char)payload[0] == '1') {
    Serial.print("uno");
    digitalWrite(led, HIGH); 
  } else {
    Serial.print("cero");
    /* we got '0' -> on */
    digitalWrite(led, LOW);
  }

}

void mqttconnect() {
  /* Loop until reconnected */
  while (!client.connected()) {
    Serial.print("MQTT connecting ...");
    /* client ID */
    String clientId = "ESP32Client_test";
    /* connect now */
    if (client.connect(clientId.c_str())) {
      Serial.println("connected");
      /* subscribe topic */
      client.subscribe(LED_TOPIC);
    } else {
      Serial.print("failed, status code =");
      Serial.print(client.state());
      Serial.println("try again in 5 seconds");
      /* Wait 5 seconds before retrying */
      delay(5000);
    }
  }
}

void setup() {
  //Initialize serial and wait for port to open:
  Serial.begin(115200);
  delay(100);

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

  /* set led as output to control led on-off */
  pinMode(led, OUTPUT);
  
  espClient.setCACert(test_root_ca); //
  
  //client.setCertificate(test_client_key); // for client verification
  //client.setPrivateKey(test_client_cert);  // for client verification

  /*
   * Connection via connect function (WiFiClientSecure)
   * Inside the connect function there's a call to another function in the ssl_client library, where the tls/ssl connection is set up
   */
  Serial.println("\nStarting connection to server...");
  if (!espClient.connect(server, 8883))
    Serial.println("Connection failed!");
  else {
    Serial.println("Connected to server!");
  }
  //client.setServer(server, 8883); //connection via Pubsubclient lib

  client.setCallback(receivedCallback); 
}

int counter = 0;
long lastMsg = 0;
char msg[20];
void loop() {
  /* if client was disconnected then try to reconnect again */
  if (!client.connected()) {
    mqttconnect();
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
