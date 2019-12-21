#include <WiFi.h>
#include </home/jamengual/Desktop/UIB/TFG/mqtt/prueba1_tls/src/dependencies/WiFiClientSecure/WiFiClientSecure.h>
#include <PubSubClient.h>
//#include <ESPmDNS.h>

/* change it with your ssid-password */
const char* ssid = "MOVISTAR_AD49";
const char* password = "jwuEP2oQUAS8Jt2PbaxB";
/* this is the MDNS name of PC where you installed MQTT Server */
const char* serverIp = "192.168.1.43";

const char* ca_cert = \ 
"-----BEGIN CERTIFICATE-----\n" \
"MIIDIzCCAgugAwIBAgIUTd2Yl5R848td5oeNgfZ+iigKTJswDQYJKoZIhvcNAQEL\n" \
"BQAwITELMAkGA1UEBhMCRVMxEjAQBgNVBAMMCW1vc3F1aXR0bzAeFw0xOTEyMTIy\n" \
"MjQ4MDJaFw0yMDEyMTEyMjQ4MDJaMCExCzAJBgNVBAYTAkVTMRIwEAYDVQQDDAlt\n" \
"b3NxdWl0dG8wggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQDu2wD5OUTZ\n" \
"20UmvCoNMUR3QgKEi+W/y7e4YE0vM1duhzocPAxEBd0PyOkQFRIT9YGZbl0vDqIg\n" \
"JsAWrh3209Qkf5u9vmaTucOAUlWozim1XtWPUi1+USANziCsgIXdGWC3UiUgN2rf\n" \
"swNHgeS1GcOyowEB9wdMqk5vsfkJQc0eOzzpGDl5BOqB2u65HEjf8HuM1re5++jy\n" \
"g29Lip+2oeAm5493LL9+uKmvOoiafi64L8ssiD0zH7GVyfu5jU06ClhZ89Qcocu6\n" \
"i8c3Qkbu54c7QC8m0EtAwhSgb0FYEGx4Q30PzVv0q8gcUDbib/xsHJLBm3DUTrfJ\n" \
"U5pWwfKSQPS9AgMBAAGjUzBRMB0GA1UdDgQWBBSSa4crv/FZSPvQDgvnRKIiWp1c\n" \
"UDAfBgNVHSMEGDAWgBSSa4crv/FZSPvQDgvnRKIiWp1cUDAPBgNVHRMBAf8EBTAD\n" \
"AQH/MA0GCSqGSIb3DQEBCwUAA4IBAQDWGc/YRAM9XpN8r8r2rMz8eZL/zvIr+RQg\n" \
"9ZRQRvKPuwGhkQhakCFNx73Z9qVbQ53fX5Z5b2hvh7zl1xFTuVLuJcIPFiNvn/6k\n" \
"PLygiOV91LuXBZJydssA8pV2sXPFm5/uMZ9A+aDAb7aUzifGpGWX7360riepW3s3\n" \
"6Xgmp6cVQs0JYKCpmPQFdir8qMnaCziVUvnukd3cGj7R3feSxL65gR0fIcBkyrZr\n" \
"eHbAko9PYULIJ/IDlh7RKeKWBrP5Jubdq6RMjNRLmlNTE8dnhUFVspxCgH/GX/H2\n" \
"iFNRLSLjIoEDWnqTTl6XoCD+dZPUZCNScu0sq09cgutfOaXcsmsG\n" \ 
"-----END CERTIFICATE-----\n";

/* create an instance of WiFiClientSecure */
WiFiClientSecure espClient;
PubSubClient client(espClient);

/*LED GPIO pin*/
const int led = 2;

/* topics */
#define COUNTER_TOPIC    "smarthome/room1/counter"
#define LED_TOPIC     "smarthome/room1/led" /* 1=on, 0=off */

long lastMsg = 0;
char msg[20];
int counter = 0;

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
    Serial.print("000000");
    /* we got '0' -> on */
    digitalWrite(led, LOW);
  }

}

void mqttconnect() {
  /* Loop until reconnected */
  while (!client.connected()) {
    Serial.print("MQTT connecting ...");
    /* client ID */
    String clientId = "ESP32Client";
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
  Serial.begin(115200);
  // We start by connecting to a WiFi network
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  /* set led as output to control led on-off */
  pinMode(led, OUTPUT);

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
  
  /*setup MDNS for ESP32 */
 /* if (!MDNS.begin("esp32")) {
      Serial.println("Error setting up MDNS responder!");
      while(1) {
          delay(1000);
      }
  }*/
 /* get the IP address of server by MDNS name */
 /* Serial.println("mDNS responder started");
  IPAddress serverIp = MDNS.queryHost(serverHostname);
  Serial.print("IP address of server: ");
  Serial.println(serverIp.toString()); */
  /* set SSL/TLS certificate */
  espClient.setCACert(ca_cert);
  /* configure the MQTT server with IPaddress and port */
  client.setServer(serverIp, 8883);
  /* this receivedCallback function will be invoked 
  when client received subscribed topic  */
  client.setCallback(receivedCallback); 
  
}
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
      client.publish(COUNTER_TOPIC, msg);
    }else {
      counter = 0;  
    }
  }
}
