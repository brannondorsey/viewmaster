var fs = require('fs-extra');

function DataHandler(){
	this.dataPath = "data/";
}

//------------------------------------------------------------------
//load functions

//returns slide data on true and false on failure
DataHandler.prototype.loadSlideData = function(reelNumber, imageNumber){
	var path = this._getPath(reelNumber, imageNumber) + ".json";
	if(fs.existsSync(path)){
		return fs.readJSONSync(path);
	}else return false;
}

//------------------------------------------------------------------
//Save functions

//bool reflecting success
DataHandler.prototype.saveDescription = function(reelNumber, imageNumber, description){
	var slideObj = this.loadData(reelNumber, imageNumber);
	if(slideObj){
		slideObj.description = description;
		fs.outputJSONSync(this._getPath(reelNumber, imageNumber) + ".json");
		return true;
	}else return false;
}

//bool reflecting success
DataHandler.prototype.saveEvent = function(reelNumber, imageNumber, event){
	var slideObj = this.loadData(reelNumber, imageNumber);
	if(slideObj){
		slideObj.events.push(events);
		fs.outputJSONSync(this._getPath(reelNumber, imageNumber) + ".json");
		return true;
	}else return false;
}

//bool reflecting success
DataHandler.prototype.saveItem = function(reelNumber, imageNumber, item){
	var slideObj = this.loadData(reelNumber, imageNumber);
	if(slideObj){
		slideObj.items.push(item);
		fs.outputJSONSync(this._getPath(reelNumber, imageNumber) + ".json");
		return true;
	}else return false;
}

//------------------------------------------------------------------
//Private functions

DataHandler.prototype._getPath = function(reelNumber, imageNumber){
	var folderName = reelNumber.toString();
	var fileName = imageNumber.toString();
	return this.dataPath + folderName + '/' + fileName;
}

module.exports = DataHandler;