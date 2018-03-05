(function(){
    //global variables
    //the address of the api whence come our questions
var queryURL = "https://qriusity.com/v1/questions/";
    //the html elements we'll be manipulating
var $introScreen = $("#introScreen"),
    $gameScreen = $("#gameScreen"),
    $resultsScreen = $("#resultsScreen"),
    $timer = $("#timer"),
    $question = $("#question"),
    $score = $("#score"),
    $wrong = $("#wrong")
    $a = $("#1"),
    $b = $("#2"),
    $c = $("#3"),
    $d = $("#4"),
    $1 = $("#option1"),
    $2 = $("#option2"),
    $3 = $("#option3"),
    $4 = $("#option4");
    //variables for our time-and-record-keeping
var intervalID,
    timer = 15,
    asked = [],
    activeQ = false;
    correctAns = 0;
    score = 0;
    wrong = 0;
function getQuestion() {
    $(".option").css({"background": "blue"});
    var random = (Math.floor(Math.random() * 17903)+ 1);
    //if the chosen question hasn't been asked this game...
    if (asked.indexOf(random) === -1) {
        //mark the chosen question as having been asked this game
        asked.push(random);
        //then query the API for a the question whose id matches the chosen number
        $.ajax({
            url: queryURL + random,
            method: "GET"
        }).then(function(response) {
        correctAns = response[0].answers;
        //update the screen with the question
        $question.text(response[0].question);
        $1.text(response[0].option1);
        $2.text(response[0].option2);
        $3.text(response[0].option3);
        $4.text(response[0].option4);
        //reset the timer and start a countdown
        timer = 15;
        $timer.text(timer);
        intervalID = setInterval(count, 1000);
        activeQ = true;
        });
    }
    //if the question has already been asked this game, try again
    else {getQuestion()};
};
function incorrect(int) {
    //stop the timer 
    clearInterval(intervalID);
    //increment the wrong guesses counter
    wrong ++;
    //if we weren't sent here by a timeout, highlight the incorrect guess in red
        if (int !== 0) {$("#" + int).css({"background-color": "red"});}
    //highlight the correct answer in green
    switch (correctAns) {
        case 1: {$a.css({"background-color": "green"}); break;}
        case 2: {$b.css({"background-color": "green"}); break;}
        case 3: {$c.css({"background-color": "green"}); break;}
        case 4: {$d.css({"background-color": "green"}); break;}
        default: {alert("something went wrong");}
    }
    //If 10 questions have been asked, end the game. Otherwise, ask another question
    if (asked.length > 9) {setTimeout(endgame, 3000);}
    else {setTimeout(getQuestion, 3000);}
}
function correct(int) {
    //stop the timer
    clearInterval(intervalID);
    //increment the score counter
    score ++;
    //highlight the correct guess in green
    $("#" + int).css({"background-color": "green"});
    //if 10 questions have been asked, game ends. otherwise, ask another question
    if (asked.length > 9) {setTimeout(endgame, 3000);}
    else {setTimeout(getQuestion, 3000);}

}
function count() {
    timer --;
    $timer.text(timer);
    if (timer <1) {incorrect(0);}
}
function endgame () {
    //hide the game screen, bring up the endgame, and display the number of right and wrong guesses
    $gameScreen.css({"display": "none"});
    $resultsScreen.css({"display": "block"});
    $score.text(score);
    $wrong.text(wrong);
}
//function to handle guesses.
$(".option").click(function(event){
    //only do something if there is a question active
    if (activeQ) {
        activeQ = false;
        //store the guess as a variable and compare it against the correct answer. Then call the correct or incorrect function depending.
        var guess = event.currentTarget.id;
        if(guess == correctAns){correct(guess);}
        else{incorrect(guess);}
    }
});
//function to start a new game
$(".start").click(function(){
    //reset the scores and asked questions
    score = 0;
    wrong = 0;
    asked = [];
    //hide the intro or results screen and bring up the game screen
    $introScreen.css({"display": "none"});
    $resultsScreen.css({"display": "none"});
    $gameScreen.css({"display": "block"});
    //Then ask the first question
    getQuestion();
});
})();