var program = require('commander');


//---------------------------------------------------------
var promptIndex = 0;
var promptType;
var defaultPrompt = "> ";
var commands = dataHand.getCommands();

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
	for(var i = 0; i < commands.length; i++){
		var command = commands[i];
		if(command.usage == response){
			passes = i;
			break;
		}else if(command.regex !== 'undefined'){
			var regex = new Regex(command.regex);
			if(regex.test(response)){
				passes = i;
				break;
			}
		}
	}
	
	return output;
}