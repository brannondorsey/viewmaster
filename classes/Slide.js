function Slide(reelNumber, imageNumber){
	this.reelNumber = reelNumber;
	this.imageNumber = imageNumber;
	var data = DataHandler.loadData(reelNumber, imageNumber);
	this.description = data.description;
	this.events = data.events;
	this.items = data.items;
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

Slide.prototype.addEvent = function(_name, _year, _season, _body){
	var eventObj = {
		name: _name,
		year: _year,
		season: _season,
		body: _body
	}
	this.events.push(eventObj);
}

Slide.prototype.addItem = function(_name, _description, _notes){
	if(notes === undefined) notes = [];
	var itemObj = {
		name = _name;
		description = _description;
		notes = _notes;
	}
	this.items.push(itemObj);
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

Slide.prototype.advance = function(){
	var newImageNumber = (this.imageNumber < 7) ? this.imageNumber : 1;
	this = new Slide(this.reelNumber, newImageNumber);
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
