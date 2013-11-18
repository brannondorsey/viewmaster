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
	this.reelNumber = reelNumber;
	this.imageNumber = imageNumber;
	this.name = data.name;
	this.description = data.description;
	this.events = data.events;
	this.items = data.items;
	this.newEvent = {};
	this.newItem = {};
	this.newItem.notes = [];
	this.selectedItem;
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
	season = season.toLowerCase();
	season = season.charAt(0).toUpperCase() + season.slice(1);
	this.newEvent.season = season;
}

Slide.prototype.addEventDescription = function(description){
	this.newEvent.description = description;
}

//------------------------------------------------------------------
//Functions for updating this.newItem or this.selectedItem

//'add <item> note' preFunction
Slide.prototype.selectItem = function(response, hasParameter){
	if(hasParameter){
		var item = this._getItemByName(response);
		if(item){
			this.selectedItem = item;
			return true;
		}else console.log('This item doesn\'t exist. Type \'get item list\' to view available items.');		
	}
	return false;
}

Slide.prototype.addItemName = function(name){
	this.newItem.name = name;
}

Slide.prototype.addItemDescription = function(description){
	this.newItem.description = description;
}

Slide.prototype.addItemNote = function(note){
	this.selectedItem.notes.push(note);
}

//------------------------------------------------------------------
//Forwards and functions for saving and reloading slide data

Slide.prototype.saveDescription = function(){
	if(dataHand.saveDescription(this.reelNumber, this.imageNumber, this.description)){
		this.reload();
		if(this.logChanges) console.log("Descpription saved.");
	}else console.log("Error saving description.");
}

Slide.prototype.saveEvent = function(){
	if(dataHand.saveEvent(this.reelNumber, this.imageNumber, this.newEvent)){
		//this.events.push(this.newEvent);
		this.reload();
		this.newEvent = {}; //clear this.newEvent
		if(this.logChanges) console.log("Event saved.");
	}else console.log("Error saving event.");
}

Slide.prototype.saveItem = function(){
	
	if(dataHand.saveItem(this.reelNumber, this.imageNumber, this.newItem)){
		this.reload();
		this.newItem = {}; //clear this.newEvent
		if(this.logChanges){
			console.log("Item saved. You should add some notes too: 'add <item> note'.");
		}
	}else console.log("Error saving item");
}

Slide.prototype.saveItemNote = function(){
	var selectedItemName = this.selectedItem.name.toLowerCase();
	var index;
	for(var i = 0; i < this.items.length; i++){
		var item = this.items[i];
		if(item.name.toLowerCase() == selectedItemName) index = i;
	}
	this.items[index] = this.selectedItem;
	if(dataHand.saveItem(this.reelNumber, this.imageNumber, this.items, true)){
		this.reload();
		this.newItem = {}; //clear this.newEvent
		if(this.logChanges){
			console.log("Item note saved.");
		}
	}else console.log("Error saving item.");	
	this.selectedItem = {};
}

Slide.prototype.reload = function(){
	this.load(this.realNumber, this.imageNumber);
}

//------------------------------------------------------------------
//Functions for printing to the console

Slide.prototype.printName = function(){
	console.log(this.name);
}

Slide.prototype.printDescription = function(){
	console.log(this._format(this.description));
}

Slide.prototype.printHistory = function(){
	var events = this.getHistory();
	if(events.length > 0){
		console.log();
		for(var i = 0; i < events.length; i++){
			var event = events[i];
			console.log(event.name + ', ' + event.season + ' ' + event.year);
			console.log(this._format(event.description));
			console.log();
		}
	}else console.log('There are no events assosciated with this location yet.');
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

Slide.prototype.printEvent = function(response, hasParameter){
	var event = this.getEvent(response, hasParameter);
	if(event){
		console.log();
		console.log(event.name + ', ' + event.season + ' ' + event.year);
		console.log(this._format(event.description));
		console.log();
	}else return false;
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
		console.log("No items have been added to this location yet.");
	} 
}

Slide.prototype.printItemDescription = function(response, hasParameter){
	if(hasParameter){
		var parameter = response;
		var item = this._getItemByName(parameter);
		if(item){
			console.log(this._format(item.description));
			return true;
		}else console.log('This item doesn\'t exist. Type \'get item list\' to view available items.');
	}
	return false;
}

Slide.prototype.printItemNotes = function(response, hasParameter){
	if(hasParameter){
		var parameter = response;
		var item = this._getItemByName(parameter);
		if(item){
			var numNotes = item.notes.length;
			if(numNotes > 0){
				console.log();
				for(var i = 0; i < numNotes; i++){
					var note = item.notes[i];
					console.log(this._format(note));
					console.log();
				}
			}else console.log('This item doesn\'t have any notes. Add one using \'add <item> note\'.');
			return true;
		}else console.log('This item doesn\'t exist. Type \'get item list\' to view available items.');
	}
	return false;
}

//------------------------------------------------------------------

//returns 1 if true and -1 if false
Slide.prototype.shouldContinue = function(response){
	return (response.trim().toLowerCase() == 'y') ? 1 : -1;
}

Slide.prototype.getHistory = function(){
	var copy = this.events.slice(0);
	return copy.sort(function(a,b){
		var aYear = parseInt(a.year);
		var bYear = parseInt(b.year);
		return aYear - bYear;
	});
}

//returns an event object on success and false on failure
Slide.prototype.getEvent = function(response, hasParameter){
	if(hasParameter){
		var event = this._getEventByName(response);
		if(event) return event;
	}else if(this.events.length > 0){
		var random = Math.floor(Math.random() * this.events.length);
		return this.events[random];
	}
	return false;
}

Slide.prototype.getEventList = function(){
	var eventNames = [];
	for(var i = 0; i < events.length; i++){
		eventNames[i] = events[i].name;
	}
	return eventNames.reverse();
}

Slide.prototype.advance = function(response, hasParameter){
	if(hasParameter) {
		var imageNumber = parseInt(response);
		this.load(this.reelNumber, imageNumber);
	}else{
		var newImageNumber = (this.imageNumber < 7) ? this.imageNumber + 1 : 1;
		this.load(this.reelNumber, newImageNumber);
	}
	if(this.logChanges)console.log("Slide advanced.");
}

Slide.prototype.newReel = function(reelNumber){
	if(dataHand.reelExists(reelNumber)){
		this.load(reelNumber, 1);
		console.log('Reel loaded.');
	}else console.log('Reel not found. Are you sure that you entered the correct reel number?');
}

//returns event obj if one is found and false if one is not
Slide.prototype._getEventByName = function(name){
	for(var i = 0; i < this.events.length; i++){
		if(this.events[i].name.toLowerCase() == name.toLowerCase()) return this.events[i];
	}
	return false;
}

//returns event obj if one is found and false if one is not
Slide.prototype._getItemByName = function(name){
	for(var i = 0; i < this.items.length; i++){
		if(this.items[i].name.toLowerCase() == name.toLowerCase()) return this.items[i];
	}
	return false;
}

//creates linebreaks so as not to create linebreaks in the middle of words
Slide.prototype._format = function(str){
	var maxCharWidth = 75;
	//console.log(str);
	if(str.length > maxCharWidth){
		for(var i = maxCharWidth; i < str.length; i+=maxCharWidth){
			var scanningForSpace = true;
			var index = i;
			while(scanningForSpace){
				if(str.charAt(index) == ' '){
					//below is an equivelancy of string.replaceAt
					str = str.substr(0, index) + '\n' + str.substr(index+'\n'.length);
					scanningForSpace = false;
				}else index--;
			}
		}
	}
	return str;
}

module.exports = Slide;
