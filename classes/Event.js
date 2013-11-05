function Event(eventObj){
	this.name = eventObj.name;
	this.year = eventObj.year;
	this.season = uCFirst(eventObj.season.toLowerCase());
	this.body = eventObj.body;
}

Event.prototype.getDate = function(){
	return this.season + " " + this.year;
}