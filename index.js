var fs = require('fs-extra');
var Slide = require('./classes/Slide');
global['printHelp'] = printHelp;
global['clearConsole'] = clearConsole;

//---------------------------------------------------------
var slide = new Slide(1420, 1);
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
	onEnter(str, function(response){
		var nextPromptStr = parse(response);
		var output = (nextPromptStr != '') ? nextPromptStr + '\n' + defaultPrompt : defaultPrompt; 
		prompt(output);
	});
}

function onEnter(str, fn){
	process.stdout.write(str);
	process.stdin.setEncoding('utf8');
	process.stdin.once('data', function(val){
	  fn(val.trim());
	}).resume();
}

//returns the string for the next prompt
function parse(response){

	var output = '';
	var passes = false;
	var finishedPrompt = false;
	var command;
	var success = true;
	//console.log();
	//check if the response is a main command
	for(var i = 0; i < commands.length; i++){
		command = commands[i];
		//console.log(command);
		//console.log(command.usage);
		if(command.usage.toLowerCase() == response.toLowerCase()){
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

		//var success = true;

		var required = parseParameter(command.usage, response, '<>');
		var optional = parseParameter(command.usage, response, '[]');
		var hasParameter = false;
		
		if(required !== false){
			response = required
			hasParameter = true;
		}else if(optional !== false){
			response = optional;
			hasParameter = true;
		}

		//if there are prompts
		if(typeof command.prompts !== 'undefined'){

			currentPromptMax = promptMaxes[command.usage] + 1;
			currentParentCommand = command;
			if(command.preFunction !== undefined){
				if(command.class == 'slide'){
					success = slide[command.preFunction](response, hasParameter);
				}
			}

		}else{ //if there are no prompts execute the command

			var fn = command.function;
			if(command.class == 'slide'){
				success = slide[fn](response, hasParameter);
			}else if(command.class == 'global'){
				success = global[fn](response, hasParameter);
			}
		}
		if(success === false) console.log(command.error);
		
	}

	// console.log("current prompt max " + currentPromptMax);
	// console.log("current prompt index " + promptIndex);
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
					success = slide[previousPrompt.function](response);
					promptIndex++;
					//if a checkContinue function was passed an 'n'
					if(success == -1){
						//do nothing and break out of the prompt list
						promptIndex = 0;
						currentPromptMax = 0;
						finishedPrompt = true;
					}
					else if(promptIndex != currentPromptMax){ //if there are still more prompts...
						output = prompt.prompt;
					}else{ //if all prompts have been completed
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
	   !finishedPrompt &&
	   response != '') output = "Command not found. Type 'help' for a list of valid commands.";
	
	return output;
}

//returns the optional or required parameter if one exists
//and false if one does not
function parseParameter(usage, response, characters){
	var openingChar = characters.charAt(0);
	var closingChar = characters.charAt(1);
	var openIndex = usage.indexOf(openingChar);
	var closeIndex = usage.indexOf(closingChar);

	if(openIndex != -1 &&
	   closeIndex != -1){
		var removal = [];
		removal[0] = usage.substring(0, openIndex - 1);
		removal[1] = usage.substring(closeIndex + 1);

		var parameter
		// //if a parameter was provided
		// if(parameter != removal[0]){
		parameter = response.replace(removal[0], '');
		// console.log('The parameter after front manipulation is: ' + parameter);
		parameter = parameter.replace(removal[1], '');
		// console.log('The parameter after all manipulation is: ' + parameter);
		if(parameter != '') return parameter.trim();
		//}
	}
	return false;
}


function printHelp(){
	var charBeforeDescription = 25;
	var padding = getSpaces(charBeforeDescription - "usage:".length);

	console.log();
	console.log('<name> denotes required parameter while [name] denotes an optional parameter.');
	console.log();
 	console.log("usage:" + padding + "description:");
	for(var i = 0; i < commands.length; i++){
		var command = commands[i];
		var paddingLength = charBeforeDescription - command.usage.length;
		padding = getSpaces(paddingLength);
		console.log(command.usage + padding + command.description);
	}
	console.log();
}

function clearConsole(){
	var numLines = 30;
	var returns;
	for(var i = 0; i < numLines; i++){
		returns += '\n';
	}
	console.log(returns);
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

function getSpaces(numSpaces){
	var padding = '';
	for(var j = 0; j < numSpaces; j++){
		padding += ' ';
	}
	return padding;
}