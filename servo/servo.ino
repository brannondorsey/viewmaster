
#include <Servo.h>

int transistor = 7;
boolean advance = false;
byte advanceByte = 127;
byte finishedByte = 0;

int s = 15; //speed of change
int wait = 500; //how long to wait once 180 is reached
 
Servo myservo;  // create servo object to control a servo 
                // a maximum of eight servo objects can be created 
 
int pos = 0;    // variable to store the servo position 
 
void setup() 
{ 
  Serial.begin(9600);
  myservo.attach(9);  // attaches the servo on pin 9 to the servo object
  pinMode(transistor, OUTPUT);
} 
 
 
void loop() 
{ 
  if(Serial.available()){
    byte incoming = Serial.read();
    if(incoming == advanceByte){
      advance = true;
    }
  }
  
  if(advance){
    digitalWrite(transistor, HIGH);
    for(pos = 0; pos < 180; pos ++)  // goes from 0 degrees to 180 degrees 
    {                                  // in steps of 1 degree 
      myservo.write(pos);              // tell servo to go to position in variable 'pos' 
      delay(s);                       // waits 15ms for the servo to reach the position 
    } 
    delay(wait);
    for(pos = 180; pos >= 1; pos--)     // goes from 180 degrees to 0 degrees 
    {                                
      myservo.write(pos);              // tell servo to go to position in variable 'pos' 
      delay(s);                       // waits 15ms for the servo to reach the position 
    }
    advance = false;
    Serial.write(finishedByte);
    digitalWrite(transistor, LOW);
  } 
} 
