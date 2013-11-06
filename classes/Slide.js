function Slide(reelNumber, imageNumber){
	this.logChanges = true;
	this.reelNumber = reelNumber;
	this.imageNumber = imageNumber;
	var data = DataHandler.loadData(reelNumber, imageNumber);
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
	}console.log("Error saving description");
}

Slide.prototype.saveEvent = function(){
	if(dataHand.saveEvent(this.reelNumber, this.imageNumber, this.newEvent)){
		//this.events.push(this.newEvent);
		this.reload();
		this.newEvent = {}; //clear this.newEvent
		if(this.logChanges) console.log("Event saved");
	}console.log("Error saving event");
}

Slide.prototype.saveItem = function(bFromSaveNoteFunction){
	if(dataHand.saveItem(this.reelNumber, this.imageNumber, this.newItem)){
		this.reload();
		this.newItem = {}; //clear this.newEvent
		if(this.logChanges){
			var output;
			if(bFromSaveNoteFunction) output = "Note saved";
			else output = "Item saved. You should add some notes too: 'add <item> note'"
			console.log(output);
		}
	}console.log("Error saving item");
}

Slide.prototype.saveNote = function(){
	this.saveItem(true); //just resave the item because its notes property was updated
}

Slide.prototype.reload = function(){
	this = new Slide(this.realNumber, this.imageNumber);
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
	if(name !== 'undefine'){
		return this._getEventByName(name);
	}else{
		var random = Math.floor(Math.random() * this.events.length);
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
	if(imageNumber !== 'undefined') {
		this = new Slide(this.reelNumber, imageNumber);
	}else{
		var newImageNumber = (this.imageNumber < 7) ? this.imageNumber : 1;
		this = new Slide(this.reelNumber, newImageNumber);
	}
}

Slide.prototype.newReel = function(reelNumber){
	this = new Slide(reelNumber, 1);
}

//returns event obj if one is found and false if one is not
Slide.prototype._getEventByName = function(name){
	for(int i = 0; i < this.events.length; i++){
		if(this.events[i].name == name) return this.events[i];
	}
	return false;
}

module.exports = Slide;
