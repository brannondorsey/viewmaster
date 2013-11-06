var program = require('commander');
var fs = require('fs-extra');
var Slide = require('./classes/Slide');

//---------------------------------------------------------
var slide = new Slide(1, 1);
var commands = fs.readJSONSync("commands.json");

var promptIndex = 0;
var promptMaxes = getPromptMaxes(commands);
var defaultPrompt = "> ";


prompt(defaultPrompt);

//---------------------------------------------------------

function prompt(str){
	program.prompt(str, function(response){
		var nextString = parse(response);
		prompt(nextString);
	});
}

//returns the string for the next prompt
function parse(response){

	var output = defaultPrompt;
	var passes = false;
	var responseToPrompt = false; //COME BACK AND USE THIS

	for(var i = 0; i < commands.length; i++){
		var command = commands[i];
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

	//if the input matched a usage or a regular expression
	if(passes !== false){
		command = commands[i];

		//if there are prompts
		if(typeof command.prompts !== 'undefined'){

			var maxPrompts = promptMaxes[command.usage];
			
			//if there are more prompts left
			if(promptIndex < maxPrompts){
				var prompt = command.prompts[promptIndex];
				var regex = RegExp(prompt.regex, 'i');
				if(regex.test(response)){

					//if this is the first prompt
					if(promptIndex == 0){
						promptIndex++;
						output = prompt.prompt;
					}else{
						slide[prompt.function]();
						console.log("I should have just called the function");
						output = command.prompts[promptIndex].prompt;
						promptIndex++;
					}
				}else output = prompt.error;
			}else{ //if all prompts have been completed

				if(command.prompt.class == 'slide'){

					//call the function
					slide[command.function]();
				}
				promptIndex = 0;
			}
		}else{ //if there are no prompts
			if(command.class == 'slide'){
				slide[command.function]();
			}
		}
	}else output = "Command not found. Type 'help' for a list of valid commands."
	
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