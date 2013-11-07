var DataHandler = require("./DataHandler");
var dataHand = new DataHandler(); //keep dataHand private

function Slide(reelNumber, imageNumber){
	this.logChanges = true;
	this.reelNumber = reelNumber;
	this.imageNumber = imageNumber;
	this.load();
}

Slide.prototype.load = function(reelNumber, imageNumber){
	if(reelNumber === undefined) reelNumber = this.reelNumber;
	if(imageNumber === undefined) imageNumber = this.imageNumber;
	var data = dataHand.loadSlideData(reelNumber, imageNumber);
	this.description = data.description;
	this.events = data.events;
	this.items = data.items;
	this.newEvent = {};
	this.newItem = {};
	this.newItem.notes = [];
}

//------------------------------------------------------------------
//Functions for updating this slides properties

Slide.prototype.addDescription = function(description){
	this.description = description;
}

//------------------------------------------------------------------
//Functions for updating this.newEvent

Slide.prototype.addEventName = function(name){
	this.newEvent.name = name;
}

Slide.prototype.addEventYear = function(year){
	this.newEvent.year = year;
}

Slide.prototype.addEventSeason = function(season){
	this.newEvent.season = season;
}

Slide.prototype.addEventDescription = function(description){
	this.newEvent.description = description;
}

//------------------------------------------------------------------
//Functions for updating this.newItem

Slide.prototype.addItemName = function(name){
	this.newItem.name = name;
}

Slide.prototype.addItemDescription = function(description){
	this.newItem.description = description;
}

//returns true on success and false on failure
Slide.prototype.addItemNote = function(itemName, note){
	for(var i = 0; i < this.items.length; i++){
		if(this.items[i].name == itemName){
			this.items[i].notes.push(note);
			return true;
		}
	}
	return false;
}

//------------------------------------------------------------------
//Forwards and functions for saving and reloading slide data

Slide.prototype.saveDescription = function(){
	if(dataHand.saveDescription(this.reelNumber, this.imageNumber, this.description)){
		this.reload();
		this.description = ""; //clear the description
		if(this.logChanges) console.log("Descpription saved");
	}else console.log("Error saving description");
}

Slide.prototype.saveEvent = function(){
	if(dataHand.saveEvent(this.reelNumber, this.imageNumber, this.newEvent)){
		//this.events.push(this.newEvent);
		this.reload();
		this.newEvent = {}; //clear this.newEvent
		if(this.logChanges) console.log("Event saved");
	}else console.log("Error saving event");
}

Slide.prototype.saveItem = function(bFromSaveNoteFunction){
	// console.log("reelNumber: " + this.reelNumber);
	// console.log("imageNumber: " + this.imageNumber);
	if(dataHand.saveItem(this.reelNumber, this.imageNumber, this.newItem)){
		this.reload();
		this.newItem = {}; //clear this.newEvent
		if(this.logChanges){
			var output;
			if(bFromSaveNoteFunction === true) output = "Note saved";
			else output = "Item saved. You should add some notes too: 'add <item> note'"
			console.log(output);
		}
	}else console.log("Error saving item");
}

Slide.prototype.saveNote = function(){
	this.saveItem(true); //just resave the item because its notes property was updated
}

Slide.prototype.reload = function(){
	this.load(this.realNumber, this.imageNumber);
}

//------------------------------------------------------------------
//Functions for printing to the console

Slide.prototype.printDescription = function(){
	console.log(this.description);
}

Slide.prototype.printHistory = function(){
	var events = this.getHistory();
	if(events.length > 0){
		console.log();
		for(var i = 0; i < events.length; i++){
			var event = events[i];
			console.log(event.name + ', ' + event.season + ' ' + event.year);
			console.log(event.description);
			console.log();
		}
	}else console.log("There are no events assosciated with this location yet.");
}

Slide.prototype.printEventList = function(){
	console.log();
	if(this.events.length > 0){
		for(var i = 0; i < this.events.length; i++){
			var event = this.events[i];
			console.log(event.name);
		}
		console.log();
	}else{
		console.log("There are no events assosciated with this location yet.");
	} 
}

Slide.prototype.printEvent = function(eventName){
	var event = this.getEvent(eventName);
	console.log();
	console.log(event.name + ', ' + event.season + ' ' + event.year);
	console.log(event.description);
	console.log();
}

Slide.prototype.printItemList = function(){
	console.log();
	if(this.items.length > 0){
		for(var i = 0; i < this.items.length; i++){
			var item = this.items[i];
			console.log(item.name);
		}
		console.log();
	}else{
		console.log("No items have been added to this location yet");
	} 
}

//------------------------------------------------------------------

Slide.prototype.getHistory = function(){
	var copy = this.events.slice(0);
	return copy.sort(function(a,b){
		var aYear = parseInt(a.year);
		var bYear = parseInt(b.year);
		return aYear - bYear;
	});
}

//returns an event object on success and false on failure
Slide.prototype.getEvent = function(name){
	var index;
	if(typeof name !== 'undefined'){
		return this._getEventByName(name);
	}else{
		var random = Math.floor(Math.random() * this.events.length);
		console.log(this.events);
		return this.events[random];
	}
}

Slide.prototype.getEventList = function(){
	var eventNames = [];
	for(var i = 0; i < events.length; i++){
		eventNames[i] = events[i].name;
	}
	return eventNames.reverse();
}

Slide.prototype.advance = function(imageNumber){
	if(typeof imageNumber !== 'undefined') {
		imageNumber = 2; //come back and take this out
		this.load(this.reelNumber, imageNumber);
	}else{
		var newImageNumber = (this.imageNumber < 7) ? this.imageNumber : 1;
		this.load(this.reelNumber, newImageNumber);
	}
	console.log("slide advanced");
}

Slide.prototype.newReel = function(reelNumber){
	this.load(reelNumber, 1);
}

//returns event obj if one is found and false if one is not
Slide.prototype._getEventByName = function(name){
	for(var i = 0; i < this.events.length; i++){
		if(this.events[i].name == name) return this.events[i];
	}
	return false;
}

module.exports = Slide;
