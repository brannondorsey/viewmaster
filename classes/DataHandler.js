var fs = require('fs-extra');

function DataHandler(){
	this.dataPath = "data/";
}

//------------------------------------------------------------------
//load functions

//returns slide data on true and false on failure
DataHandler.prototype.loadSlideData = function(reelNumber, imageNumber){
	// console.log("reelNumber from DataHandler::loadSlideData is: " + reelNumber);
	// console.log("imageNumber from DataHandler::loadSlideData is: " + imageNumber);
	var path = this._getPath(reelNumber, imageNumber) + ".json";
	if(fs.existsSync(path)){
		return fs.readJSONSync(path);
	}else return false;
}

//------------------------------------------------------------------
//Save functions

//bool reflecting success
DataHandler.prototype.saveDescription = function(reelNumber, imageNumber, description){
	var slideObj = this.loadSlideData(reelNumber, imageNumber);
	if(slideObj){
		slideObj.description = description;
		fs.outputJSONSync(this._getPath(reelNumber, imageNumber) + ".json", slideObj);
		return true;
	}else return false;
}

//bool reflecting success
DataHandler.prototype.saveEvent = function(reelNumber, imageNumber, event){
	var slideObj = this.loadSlideData(reelNumber, imageNumber);
	if(slideObj){
		slideObj.events.push(event);
		fs.outputJSONSync(this._getPath(reelNumber, imageNumber) + ".json", slideObj);
		return true;
	}else return false;
}

//bool reflecting success
DataHandler.prototype.saveItem = function(reelNumber, imageNumber, item, itemParamIsArray){
	var slideObj = this.loadSlideData(reelNumber, imageNumber);
	if(slideObj){
		//if 'item' is an array instead of an item that needs to be pushed to the slideObj.items array
		if(itemParamIsArray){
			slideObj.items = item;
		}
		else slideObj.items.push(item);
		fs.outputJSONSync(this._getPath(reelNumber, imageNumber) + ".json", slideObj);
		return true;
	}else return false;
}

//------------------------------------------------------------------
//Private functions

DataHandler.prototype._getPath = function(reelNumber, imageNumber){
	// console.log("reelNumber from inside DataHandler::_getPath is: " + reelNumber);
	// console.log("imageNumber from inside DataHandler::_getPath is: " + imageNumber);
	var folderName = reelNumber.toString();
	var fileName = imageNumber.toString();
	return this.dataPath + folderName + '/' + fileName;
}

module.exports = DataHandler;