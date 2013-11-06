var program = require('commander');
var fs = require('fs-extra');
var Slide = require('./classes/Slide');
//var keypress = require('keypress');

//---------------------------------------------------------
var slide = new Slide(1, 1);
var commands = fs.readJSONSync("commands.json");

var promptIndex = 0;
var promptMaxes = getPromptMaxes(commands);
var currentParentCommand;
var currentPromptMax;

var defaultPrompt = "> ";

//---------------------------------------------------------

prompt(defaultPrompt);

//---------------------------------------------------------

function prompt(str){
	program.prompt(str, function(response){
		response = response.trim();
		var nextPromptStr = parse(response);
		prompt(nextPromptStr + "\n\r" + defaultPrompt);
	});
}

//returns the string for the next prompt
function parse(response){

	var output = defaultPrompt;
	var passes = false;
	var finishedPrompt = false;
	var command;
	//console.log();
	//check if the response is a main command
	for(var i = 0; i < commands.length; i++){
		command = commands[i];
		//console.log(command);
		//console.log(command.usage);
		if(command.usage == response){
			passes = i;
			break;
		}else if(typeof command.regex !== 'undefined'){
			var regex = new RegExp(command.regex, 'i');
			if(regex.test(response)){
				passes = i;
				break;
			}
		}
	}
	
	//if the response was a main command and there
	//are currently no sub prompts being answered
	if(passes !== false &&
	   promptIndex == 0){
		command = commands[i];

		//if there are prompts
		if(typeof command.prompts !== 'undefined'){

			currentPromptMax = promptMaxes[command.usage] + 1;
			currentParentCommand = command;

		}else{ //if there are no prompts execute the command
			console.log("I got in here");
			if(command.class == 'slide'){

				slide[command.function](response);
			}
		}
	}

	// console.log("current prompt max " + currentPromptMax);
	//console.log("current prompt index " + promptIndex);
	if(currentPromptMax != 0 &&
	   promptIndex <= currentPromptMax){

		//if there are still prompts left
		if(promptIndex < currentPromptMax){

			var prompt = currentParentCommand.prompts[promptIndex];
			var previousPrompt = currentParentCommand.prompts[promptIndex-1];

			//if this is the first prompt
			if(promptIndex == 0){
				promptIndex++;
				output = prompt.prompt;
			}else{
				var regex = RegExp(previousPrompt.regex, 'i');
				// console.log(previousPrompt);
				//test to make sure that the response fulfills the previous prompts regex
				if(regex.test(response)){
					//console.log("got in 3");
					//if it does then execute the function assosciated with the last prompt
					slide[previousPrompt.function](response);
					promptIndex++;
					if(promptIndex != currentPromptMax){ //if there are still more prompts...
						output = prompt.prompt;
					}else{ //if all prompts have been completed
						console.log("It is my understanding that the prompts are complete");
						if(currentParentCommand.class == 'slide'){

							//call the function
							slide[currentParentCommand.function](response);
						}
						promptIndex = 0;
						currentPromptMax = 0;
						finishedPrompt = true;
					}	
				}else output = previousPrompt.error;
			}
		}
	}

	if(passes === false &&
	   promptIndex == 0 &&
	   !finishedPrompt) output = "Command not found. Type 'help' for a list of valid commands."
	
	return output;
}

//returns an assoc array of all commands that require further prompts
//with their usage as key and the number of prompts as the value
function getPromptMaxes(commands){
	var promptMaxes = [];
	for(var i = 0; i < commands.length; i++){
		var command = commands[i];
		if(typeof command.prompts !== 'undefined'){
			promptMaxes[command.usage] = command.prompts.length;
		}
	}
	return promptMaxes;
}