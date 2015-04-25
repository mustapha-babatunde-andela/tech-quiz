var answered = false;
var questions = getQuestions();
var questionsGotWrong = [];
var count = 0;
var score = 0;
var totalScore = 0;
var interval;


// timer function
function timer(time,update,complete) {
    var start = new Date().getTime();
    interval = setInterval(function() {
        var now = time-(new Date().getTime() - start);
        if( now <= 0) {
            clearInterval(interval);
            complete();
        }
        else update(Math.floor(now/1000));
    },100); // the smaller this number, the more accurate the timer will be
}

// function to run when the start over button is clicked
function startOver() {
  answered = false;
  questions = [];
  count = 0;
  questionsGotWrong = [];
  score = 0;
  totalScore = 0;
  document.getElementById('countdown').innerHTML = '0';
  questions = getQuestions();
  loadJSQuiz();
}

function reloadPage() {
  location.reload();
}

// function to call when start button is clicked
function getQuestion() {
  if (count >= questions.length) {
    document.getElementById('countdown').innerHTML = '';
    var jsQuestionDiv = document.getElementById('jsQuestions');
    document.getElementById('nextButton').disabled = true;
    while (jsQuestionDiv.hasChildNodes()) {
      jsQuestionDiv.removeChild(jsQuestionDiv.lastChild);
    }
    for (var q = 0; q < questions.length; q++) {
      totalScore = totalScore + questions[q].point;
    }
    var scorePercentage = Math.floor((score / totalScore) * 100);
    var scoreSpan = document.getElementById('quiz-details');
    var scoreMessage = '<p>Your score is: ' + score + ' points.</p>';
    scoreMessage += '<br>Which is ' + scorePercentage + '% of points obtainable <br>';
    
    // check if the questionsGotWrong array is populate to display the list of questions
    // user got wrong with answers
    if (questionsGotWrong.length > 0) {
      scoreMessage += '<h3>Questions you got wrong</h3>';
      for (var z = 0; z < questionsGotWrong.length; z++) {
        scoreMessage += '<h4 class="bold">' + questionsGotWrong[z].question + '</h4>';
        scoreMessage += 'Answer: ' + questionsGotWrong[z].ansewer + '<br>';
      }
    }

    // build up the spanInfo text;
    scoreSpan.innerHTML = scoreMessage;
    var reloadButton = document.createElement('BUTTON');
    reloadButton.setAttribute('class', 'btn btn-lg btn-success bold');
    reloadButton.setAttribute('onclick', 'reloadPage()');
    var reloadButtonText = document.createTextNode('<< Back to Home');
    reloadButton.appendChild(reloadButtonText);
    var nextLine = document.createElement('BR');

    // append both buttons to the page
    scoreSpan.appendChild(reloadButton);

    // remove the start and next buttons
    var startNextButtonsDiv = document.getElementById('startNextDiv');
    while (startNextButtonsDiv.hasChildNodes()) {
      startNextButtonsDiv.removeChild(startNextButtonsDiv.lastChild);
    }
  }

  if (count < questions.length) {
    document.getElementById('time-up').innerHTML = '';
    var jsQuestionDiv = document.getElementById('jsQuestions');
    while (jsQuestionDiv.hasChildNodes()) {
      jsQuestionDiv.removeChild(jsQuestionDiv.lastChild);
    }
    var optionsOrderedList = document.createElement('OL');
    for (var x in questions[count].choices) {
      var optionsList = document.createElement('LI');
      optionsList.setAttribute('onclick', 'checkAnswer(this)');
      var optionsTextNode = document.createTextNode(questions[count].choices[x]);
      optionsList.appendChild(optionsTextNode);
      optionsOrderedList.appendChild(optionsList);
    }
    var questionHead = document.createElement('H4');
    questionHead.className += " bold";
    var questionHeadTextNode = document.createTextNode(questions[count].question);
    questionHead.appendChild(questionHeadTextNode);
    jsQuestionDiv.appendChild(questionHead);
    jsQuestionDiv.appendChild(optionsOrderedList);
    var scoreSpan = document.getElementById('quiz-details');
    scoreSpan.innerHTML = '<p>Your score is: ' + score + ' points.</p>';
    document.getElementById('startButton').disabled = true;
    document.getElementById('nextButton').disabled = true;
    answered = false;

    // start timer
    timer(
      questions[count].time * 1000, // milliseconds
      function(timeleft) { // called every step to update the visible countdown
        document.getElementById('countdown').innerHTML = timeleft;
      },
      function() { // what to do after
        checkAnswer();
      }
    );
  }
}


// function to call when any of the options is clicked
function checkAnswer(element) {
  if (answered == false) {
    if (arguments.length == 0) {
      var liElement = document.getElementsByTagName('li');
      questionsGotWrong.push(questions[count]);
      for (var i = 0; i < liElement.length; i++) {
        liElement[i].setAttribute('class', 'answered');
      }
      document.getElementById('time-up').innerHTML = '<p>You ran out of Time!</p>';
      document.getElementById('nextButton').disabled = false;
      answered = true;
      count++;
    } else {
      clearInterval(interval);
      var answer = element.innerHTML;
      if (answer == questions[count].ansewer) {
        score = score + questions[count].point;
        element.setAttribute('class', 'correct-answer');
        var liElement = document.getElementsByTagName('li');
        for (var i = 0; i < liElement.length; i++) {
          if (liElement[i].innerHTML != questions[count].ansewer) {
            liElement[i].setAttribute('class', 'answered');
          }
        } 
      } else {
        clearInterval(interval);
        var liElement = document.getElementsByTagName('li');
        questionsGotWrong.push(questions[count]);
        for (var i = 0; i < liElement.length; i++) {
          if (liElement[i] == element) {
            element.setAttribute('class', 'wrong-answer');
          } else {
            liElement[i].setAttribute('class', 'answered')
            if (liElement[i].innerHTML == questions[count].ansewer) {
              liElement[i].setAttribute('class', 'correct-answer')
            }
          }
        }
      }
      document.getElementById('nextButton').disabled = false;
      answered = true;
      console.log(questions[count].ansewer);
      count++;
    }    
  }
}

// function that gets called when sample question is answered
function checkSampleAnswer(element) {
  if (answered == false) { 
    var answer = element.innerHTML;
    if (answer == 'Document Object Model') {
      element.setAttribute('class', 'correct-answer');
      var liElement = document.getElementsByTagName('li');
      for (var i = 0; i < liElement.length; i++) {
        if(liElement[i].innerHTML != 'Document Object Model') {
          // do nothing
          liElement[i].setAttribute('class', 'answered');
        }
      } 
    } else {
      var liElement = document.getElementsByTagName("li");
      for (var i = 0; i < liElement.length; i++) {
        if (liElement[i] == element) {
          element.setAttribute('class', 'wrong-answer');
        } else {
          liElement[i].setAttribute('class', 'answered')
          if (liElement[i].innerHTML == 'Document Object Model') {
            liElement[i].setAttribute('class', 'correct-answer')
          }
        }
      }
    }
  }
  answered = true;
  document.getElementById('startButton').disabled = false;
}

// function to run when jsButton is clicked
function loadJSQuiz() {
  var xmlhttp;
  if (window.XMLHttpRequest) { // code for IE7+, Firefox, Chrome, Opera, Safari
    xmlhttp = new XMLHttpRequest();
  } else { // code for IE6, IE5
    xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
  }
  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      document.getElementById("quiz-info").innerHTML = xmlhttp.responseText;
    }
  }
  xmlhttp.open("GET","jsQuiz.html",true);
  xmlhttp.send();
  document.getElementById("quiz-info").innerHTML = 'Waiting for response...';
}

// function that gets called once the page is done loading
function init() {
  // grab the html elements to tie click events to
  var jsButton = document.getElementById('jsButton');  // the javascript button element


  // check to see that the buttons actually exists
  if (jsButton) {
    jsButton.addEventListener('click', loadJSQuiz);
  }
}

window.onload = init; // ties the init() function to the window.onload method to trigger the function once the page is ready
