//Working Variables for Frame Drills
var randomFrame = 24; //how fast to move the bar in frames / the chosen random frame number


//Functions for Frame Drills
var tempScore = 0;// temporary score storage
function addScore(number){
	if(number > 0){
		tempScore = tempScore + number;
	}
}
function updateScore(){
	if (tempScore > 0){
		tempScore = tempScore - 1;
		score = score + 1;
		$score.html("<i class=\"fa fa-money\"></i> "+score);
	}
}
setInterval(updateScore, 30); // add score to current score

var playing = false;//game playing currently? Stop animations if not.
function playGame(){// repeat function for playing game.
	playing = true;
	randomFrame = pickRandomFrame(frameRange[1]);

			$("#message2").text("the answer is: " + randomFrame); // temporary!

	moveBar();//animate bar
}

function pauseGame(){//pause the game
	playing = false;
	stopBar();
}

var barLeftDirection = false; // direction the bar is to travel
function moveBar(){// move bar
	if(playing){//only animate if playing
		soundclick.play();//	play soundeffect
		if (barLeftDirection){ // move bar right
			barLeftDirection = false;
			$("#bar").animate( {width: "100%"} , calculateFrames(randomFrame , fps) , "linear" , moveBar );
		} else {
			barLeftDirection = true;
			$("#bar").animate( {width: "0%"} , calculateFrames(randomFrame , fps) , "linear" , moveBar );
		}
	}
}

function stopBar(){// stop bar
	$("#bar").stop(true,true);
}

function addMessage(classtitle, message){// fire off a message after answering
	var maxUp = 5; //max messages before deletion
	$("#messageHolder").prepend("<li class=\"span6 message "+classtitle+"\"><p>"+message+"</p></li>"); // create new message
	var messageBox = $("#messageHolder li");
	messageBox.first().hide().fadeIn("slow");// fade in messages nicely
	var listNum = messageBox.length; // check how many messages are there.
	if (listNum > maxUp){ // if too many messages, lop off the top.
		messageBox.last().fadeOut( "slow" , function(){$(this).remove();});
	}
}

function calculateFrames(frame , framesPerSecond){ //convert frame number to milliseconds
		var singleFrame = 1000 / framesPerSecond;
		return frame * singleFrame;
	}

function pickRandomFrame(range){ // pick random frame from frame range
		return Math.floor(Math.random() * (range[1] - range[0] + 1)) + range[0];
	}

function checkAnswer(answer , number){// checks that answer (given by user) equals number(chosen random number). Returns the difference between users answer and real answer in positive numbers.
	var numInt = parseInt(answer);// convert text input to number
	if (numInt !== numInt){ // is the input not a number? return false
		return false;
	}
	numInt = number - numInt;
	return numInt;
	}

function gup( name ){// method of getting $_GET params through javascript. Thanks to http ://www[dot]netlobo[dot]com/url_query_string_javascript[dot]html
  name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
  var regexS = "[\\?&]"+name+"=([^&#]*)";
  var regex = new RegExp( regexS );
  var results = regex.exec( window.location.href );
  if( results == null )
    return "";
  else
    return results[1];
}