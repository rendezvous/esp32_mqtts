#include <src/dependencies/WiFiClientSecure/WiFiClientSecure.h>
//#include <WiFiClientSecure.h> //this is the last version on github, but it doesn't work
#include <PubSubClient.h>


const char* ssid     = "";     // your network SSID (name of wifi network)
const char* password = ""; // your network password

const char*  server = "192.168.1.144";  


//place your CA certificate here
const char* test_root_ca= \
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

void loop() {
  /* if client was disconnected then try to reconnect again */
  if (!client.connected()) {
    mqttconnect();
  }
  /* this function will listen for incomming 
  subscribed topic-process-invoke receivedCallback */
  client.loop();
  
  
}
