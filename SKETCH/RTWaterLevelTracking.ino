#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiManager.h>   

// defines pins numbers
const int trigPin = 2;  //D4
const int echoPin = 0;  //D3
const int relayPin = 14; //D5
int counter = 0;

String deviceId = "DEL24G69-3";
String baseUrl = "http://ec2-13-233-216-6.ap-south-1.compute.amazonaws.com:8080/";

// defines variables
long duration;
float distance;
float fillpercent;

long nduration;
float ndistance;
float nfillpercent;


void setup() 
{
  //Seting GPIO14 for relay output
  pinMode(trigPin, OUTPUT); // Sets the trigPin as an Output
  pinMode(echoPin, INPUT); // Sets the echoPin as an Input

  //delay(3000);
  Serial.begin(9600);
  delay(10);

  //Setting relay to off initially in normaly open mode
  pinMode(relayPin,OUTPUT);
  digitalWrite(relayPin, HIGH);
 
	//Connecting to wifi using WIFIManager
	WiFiManager wifiManager;
	wifiManager.autoConnect("newEsp8266");
	Serial.println("");
	Serial.println("WiFi connected");
	Serial.println("IP address: ");
	IPAddress ip = WiFi.localIP();
	Serial.println(ip);	
}


void loop() 
{
  delay(2000);
	int retCodeReadM = 0;
	
	//Check if device is connected to wifi
	if (WiFi.status() != WL_CONNECTED) 
	{            
		WiFiManager wifiManager;
		wifiManager.autoConnect("newEsp8266");
		Serial.println("");
		Serial.println("WiFi connected");
		Serial.println("IP address: ");
		IPAddress ip = WiFi.localIP();
		Serial.println(ip);    
	}	

  HTTPClient http;
	
	// Clears the trigPin             
	digitalWrite(trigPin, LOW);
	delayMicroseconds(2);
	
	// Sets the trigPin on HIGH state for 10 micro seconds
	digitalWrite(trigPin, HIGH);
	delayMicroseconds(10);
	digitalWrite(trigPin, LOW);
	
	// Reads the echoPin, returns the sound wave travel time in microseconds
	duration = pulseIn(echoPin, HIGH);
	
	// Calculating the distance
	distance= (duration*0.034/2)-30;
  
	//calculating percentage
	//fillpercent = (1-(distance/92))*100;
	//deducting 16cm more from 92 to map outlet pipe distance
	fillpercent = (1-(distance/76))*100;
	Serial.print("Distance: ");
	Serial.println(distance);
	Serial.print("Distance in percent: ");
	Serial.println(fillpercent);

  if(fillpercent > 100 )
	{
		fillpercent = 100;        
	}
	else if(fillpercent < 0 )
	{
		fillpercent=0;
	}
 
	Serial.println(fillpercent);
  
  //Forcefully disconnect connection if water is 100% full
  if(fillpercent == 100)
  {
    //counter=5;//verifyFullpercentage();
    counter=verifyFullpercentage();
    if(counter == 5)
    {
      pinMode(relayPin,OUTPUT);
      digitalWrite(relayPin, HIGH);      
      Serial.println("motor stopped. wate is 100%");
      String postUrlMStat = baseUrl + "motor?d=" + deviceId + "&s=0";
      Serial.println(postUrlMStat);
      http.begin(postUrlMStat); 
      http.addHeader("Content-Type", "text/plain");
      int retCodeM = http.POST("");    
      Serial.println(retCodeM);   //Print HTTP return code
      http.end();
    }
  }
  else
  {
    counter=0;
  }
  
	if (WiFi.status() == WL_CONNECTED) 
	{     
    //Posting data to server once in a loop 
    //data sent in query     
    String postUrl = baseUrl + "water?d=" + deviceId + "&l=" + fillpercent;
    Serial.println("Water post Url");
    Serial.println(postUrl);
    http.begin(postUrl); 
    http.addHeader("Content-Type", "text/plain");
    int retCodeW = http.POST("");    
    Serial.print("RetCodeforwater ");   //Print HTTP return code
    Serial.println(retCodeW);
    http.end();    

    String getUrl     = baseUrl + "motor/" + deviceId;
    Serial.println(getUrl);
    http.begin(getUrl); 
    http.addHeader("Content-Type", "text/plain");
    retCodeReadM      = http.GET();       
    String getMData   = "0";
    getMData          = http.getString();   
    Serial.print("http Code ");   //Print HTTP return code
    Serial.println(retCodeReadM);   //Print HTTP return code
    Serial.print("Payload ");
    Serial.println(getMData); 
    http.end();
    
    if(retCodeReadM == 200){
      Serial.println(getMData);  
      
      if(getMData == "1")
      {
        digitalWrite(relayPin, LOW);
        pinMode(relayPin,INPUT);
        Serial.println("Motor Started");  
      }
      else if(getMData == "0")
      {
        pinMode(relayPin,OUTPUT);
        digitalWrite(relayPin, HIGH);
        Serial.println("Motor Stoped");  
      }    
    }
    else{
      Serial.println("Problem reading channel. HTTP error code " + String(retCodeReadM)); 
      pinMode(relayPin,OUTPUT);
      digitalWrite(relayPin, HIGH);
      Serial.println("Motor Stoped");  
    }
	}
}

//Verifying 100% 5 times 
int verifyFullpercentage()
{
  int fillFlg=0;
  for (int i = 0; i < 5; i++) 
  {
    digitalWrite(trigPin, LOW);
    delayMicroseconds(2);
      
    // Sets the trigPin on HIGH state for 10 micro seconds
    digitalWrite(trigPin, HIGH);
    delayMicroseconds(10);
    digitalWrite(trigPin, LOW);
  
    // Reads the echoPin, returns the sound wave travel time in microseconds
    nduration = pulseIn(echoPin, HIGH);
  
    // Calculating the distance
    ndistance= (nduration*0.034/2)-30;
    nfillpercent = (1-(ndistance/76))*100;
    Serial.println("Verify block percentage");
    Serial.println(nfillpercent);  
    if(nfillpercent >= 100)
    {
      fillFlg = fillFlg + 1;
    }    
  }
  return fillFlg;
}
