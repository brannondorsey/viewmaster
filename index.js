var program = require('commander');

program
	.option("next", "go to the next image in the reel.")
	.option("previous", "go to the previous image in the reel.")
	.option("go to <name>", "advance to the specified image.")
	.option("reel <name>", "")
	.option("read <name>", "")
	.option("write <\"message\">");

var options = [
	{
		word: "next",
		requiredParameter: false,
		optionalParameter: false,
		hasMultipleWords: false,
		description: "go to the next image in the reel."
	},
	{
		word: "previous",
		requiredParameter: false,
		optionalParameter: false,
		hasMultipleWords: false,
		description: "go to the previous image in the reel."
	},
	{
		word: "set",
		hasMultipleWords: true,
		description: "Used in conjunction with <reelname> or <imagename> to tell the program what image or reel you are currently looking at",
		tree: [
			{
				word: "reel",
				requiredParameter: true,
				optionalParameter: false,

			}
		]
	}
]

//---------------------------------------------------------

prompt("> ");

//---------------------------------------------------------

function prompt(str){
	program.prompt(str, function(response){
		parse(response);
		prompt(str);
	});
}

function parse(response){
	var word = getNextWord(response);
	console.log(word);
	var output;
	switch(word){
		case 'help':
			output = program.helpInformation();
			break;
		default:
			output = "Command not found. Type 'help' for command list.";
			break;
	}
	console.log(output);
}

function getNextWord(sentence){
	var index = sentence.indexOf(' ');
	var word;
	if(index != -1){
		word = sentence.substr(0, index);
	}else{
		word = sentence;
	}
	return word.trim();
}