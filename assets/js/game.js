(function(){
var queryURL = "https://qriusity.com/v1/questions/",
    $introScreen = $("#introScreen"),
    $gameScreen = $("#gameScreen"),
    $resultsScreen = $("resultsScreen"),
    $timer = $("#timer"),
    $question = $("#question"),
    $a = $("#1"),
    $b = $("#2"),
    $c = $("#3"),
    $d = $("#4"),
    $1 = $("#option1"),
    $2 = $("#option2"),
    $3 = $("#option3"),
    $4 = $("#option4"),
    intervalID,
    timer = 15,
    asked = [],
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
        console.log(response);
        correctAns = response[0].answers;
        console.log(correctAns);
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
        });
}
    //if the question has already been asked this game, try again
    else {getQuestion()};
};
function incorrect(int) {
    clearInterval(intervalID);
    wrong ++;
        if (int !== 0) {$("#" + int).css({"background-color": "red"});}
    switch (correctAns) {
        case 1: {$a.css({"background-color": "green"}); break;}
        case 2: {$b.css({"background-color": "green"}); break;}
        case 3: {$c.css({"background-color": "green"}); break;}
        case 4: {$d.css({"background-color": "green"}); break;}
        default: {alert("something went wrong");}
    }
    setTimeout(getQuestion, 5000);
}
function correct(int) {
    clearInterval(intervalID);
    score ++;
    $("#" + int).css({"background-color": "green"});
    setTimeout(getQuestion, 5000);
}
function count() {
    timer --;
    $timer.text(timer);
    if (timer <1) {incorrect(0);}
}
$(".option").click(function(event){
    var guess = event.currentTarget.id;
    console.log(guess);
    if(guess == correctAns){correct(guess);}
    else{incorrect(guess);}
});
$(".start").click(function(){
    getQuestion();
    $introScreen.css({"display": "none"});
    $resultsScreen.css({"display": "none"});
    $gameScreen.css({"display": "block"});
});
})();