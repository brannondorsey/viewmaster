import processing.serial.*;

Serial port;
byte advanceByte = 127;

void setup(){
  String[] portNames = Serial.list();
  println(portNames);
  String portName = portNames[4];
  port = new Serial(this, portName, 9600);
}

void draw(){
  
}

void keyPressed(){
  port.write(advanceByte);
}
