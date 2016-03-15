/* **** Guessing Game Functions **** */
function guessingGame() {
	this.winningNum = -1;
	this.playersGuess -1;
	this.previousGuesses = [];
	this.numOfGuessesRemaining = 10;
	this.gameWon = false;
};

// Generate the Winning Number
guessingGame.prototype.generateWinningNumber = function() {
	this.winningNum = Math.floor(Math.random()*100 + 1);
}

// Fetch the Players Guess
guessingGame.prototype.playersGuessSubmission = function() {
	if (!this.gameWon) {
		// Parse the player's input to an integer if it has a decimal  
		this.playersGuess = parseInt(+$("#usersGuess").val(), 10);
		if (this.playersGuess < 1 || this.playersGuess > 100 || isNaN(this.playersGuess)) {
			$("#message").html("Insert a valid number.");
			return false;
		}
		else if ($.inArray(this.playersGuess, this.previousGuesses) !== -1) {
			$("#message").html("Number was already inputted.");
			return false;
		}
		this.previousGuesses.push(this.playersGuess);
		$("#usersGuess").val("");
		return true;
	}
	return false;
}

// Determine if the next guess should be a lower or higher number
guessingGame.prototype.lowerOrHigher = function() {
	if (this.playersGuess < this.winningNum)
		return "higher";
	else
		return "lower";
}

guessingGame.prototype.guessMessage = function() {
	var distance = Math.abs(this.playersGuess - this.winningNum);
	var returnMessage = "Guess " + this.lowerOrHigher();
	if (distance > 50) 
		returnMessage += " farther than 50 digits away";
	else if (distance > 30)
		returnMessage += " within 50 digits away";
	else if (distance > 10)
		returnMessage += " within 30 digits away";
	else if (distance > 5)
		returnMessage += " within 10 digits away";
	else
		returnMessage += " within 5 digits away";
	return returnMessage;
}

// Check if the Player's Guess is the winning number 
guessingGame.prototype.checkGuess = function() {
	if (this.numOfGuessesRemaining > 0) {
		this.numOfGuessesRemaining--;
		$("#numOfGuesses").html(this.numOfGuessesRemaining + " Guesses Remaining");
		if (this.playersGuess === this.winningNum) {
			$("#message").html("Congrats, you guessed the correct number!");
			this.gameWon = true;
		}
		else {
			$("#message").html(this.guessMessage());
		}
	}
	else {
		$("#message").html("No more guesses available. Reset the game.");
	}
}

// Create a provide hint button that provides additional clues to the "Player"
guessingGame.prototype.provideHint = function() {
	var answerDisplayed = false;
	var possibleAnswers = "Possible Answers: ";
	for (var i = 0; i < this.numOfGuessesRemaining; i++) {
		// If the answer has not yet been displayed, and if this is the last
		// run through the for loop (we have to display the answer by then)
		// or if the randomly generated number is less than 0.3, add the winning
		// number to the list of numbers that will be displayed
		if (!answerDisplayed && 
			  ((Math.random() < 0.3) || 
			   (i == this.numOfGuessesRemaining - 1))) {
			possibleAnswers += this.winningNum;
			answerDisplayed = true;
		}
		// Else, add a random number from 1 to 100
		else {
			possibleAnswers += Math.floor(Math.random()*100 + 1);
		}
		possibleAnswers += ", ";
	}
	possibleAnswers = possibleAnswers.slice(0, -2);
	$("#message").html(possibleAnswers);
}

// Allow the "Player" to Play Again
guessingGame.prototype.playAgain = function() {
	this.generateWinningNumber();
	this.previousGuesses = [];
	this.numOfGuessesRemaining = 10;
	this.gameWon = false;
	$("#message").html("New Game");
	$("#numOfGuesses").html(this.numOfGuessesRemaining + " Guesses Remaining");
}


/* **** Event Listeners/Handlers ****  */
$(document).ready(function() {
	var gg = new guessingGame();
	gg.playAgain();
	// Run the following function if user clicks on 'Submit Guess' or presses enter
	$("#usersGuess").keypress(function(event) {
		if (event.which === 13)
			$("#submitGuess").click();
	});
	$("#submitGuess").on("click", function() {
		// Fetch the player's guess (by converting input's val to a number)
		if (gg.playersGuessSubmission()) {
			gg.checkGuess();	
		}
	});

	$("#giveHint").on("click", function() {
		if (!gg.gameWon)
			gg.provideHint();
	});
	$("#resetGame").on("click", function() {
		gg.playAgain();
	});
});