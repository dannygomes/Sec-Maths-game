var leaderBoard;
var currentHighScores = [];
var leaderBoard = [];
var lowestHighscore;
var lowestHighscoreID;
var allIDs = [];
$(window).on('load', function () {
  getHighScores();
});

function getHighScores() {
  $.ajax({
    type: 'GET',
    url: 'https://altcademy-to-do-list-api.herokuapp.com/tasks?api_key=213',
    dataType: 'json',
    success: function (response, textStatus) {
      lowestHighscore = response.tasks[0].content.split(';')[2];
      response.tasks.forEach(function (task) {
        if(task.content.split(';')[0] == 'secmaths'){
          currentHighScores.push(task.content.split(';'));
          allIDs.push(task.id);
        }
        if(task.content.split(';')[2] < lowestHighscore) {
          lowestHighscoreID = task.id;
          lowestHighscore = task.content.split(';')[2];
        }
      });
      generateLeaderboard();
      injectLeaderboard();
    },
    error: function (request, textStatus, errorMessage) {
      console.log(errorMessage);
    }
  });
}

//need to create an array with the content from each task
function generateLeaderboard() {
  currentHighScores.sort(sortScores);
  leaderBoard = [];
  for(var i = 0; i < currentHighScores.length; i++){
    leaderBoard.push(currentHighScores[i][1] + ' ' + currentHighScores[i][2]);
  }
}

function sortScores (a,b) {
  if(a[2] == b[2]){
    return 0;
  } else {
    return (a[2] > b[2]) ? -1 : 1;
  }
}

function injectLeaderboard () {
  var leaderboardHTML = '';
  $('#leaderboard > ol').html('');
  for(var i = 0; i < leaderBoard.length; i++){
    leaderboardHTML = leaderboardHTML + '<li>' + leaderBoard[i] + '</li>'
  }
  $('#leaderboard > ol').html(leaderboardHTML);
}

function getLowestHighScore () {
  var lastLineArray = leaderBoard[leaderBoard.length - 1].split(' ');
  return Number(lastLineArray[lastLineArray.length - 1]);
}

/*
 In here I need to call function to delete the lowest high score from the server and inject the new one
*/
function setNewHighscore(score) {
  $('.submit-button').on('click', function () {
    if($('#name-input-field').val().trim() == "") {
      alert("Don't forget your name!");
    } else {
      var highscore = 'secmaths' + ' ' + $('#name-input-field').val() + ' ' + score;
      currentHighScores.pop();
      currentHighScores.push(highscore.split(' '));
      generateLeaderboard();
      injectLeaderboard();

      deleteScore(lowestHighscoreID);
      postScore($('#name-input-field').val(), score);
    }
  });
}

var postScore = function (name, score) {
  $.ajax({
    type: 'POST',
    url: 'https://altcademy-to-do-list-api.herokuapp.com/tasks?api_key=213',
    contentType: 'application/json',
    dataType: 'json',
    data: JSON.stringify({
      task: {
        id: 1,
        content: 'secmaths;' + name + ';' + score,
        completed: 'false',
        due: '2017-10-21T06:01:02.000Z',
      }
    }),
    success: function (response, textStatus) {
      console.log('scores p')
    },
    error: function (request, textStatus, errorMessage) {
      console.log(errorMessage);
    }
  });  
}

var deleteScore = function (id) {
  $.ajax({
   type: 'DELETE',
      url: 'https://altcademy-to-do-list-api.herokuapp.com/tasks/' + id + '?api_key=213',
      success: function (response, textStatus) {
        console.log('lowest high score deleted');
      },
      error: function (request, textStatus, errorMessage) {
        console.log(errorMessage);
      }
    });
  }