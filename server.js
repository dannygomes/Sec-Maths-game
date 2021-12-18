var leaderBoard;
var currentHighScores = [];
var leaderBoard = [];
var lowestHighscore;
var lowestHighscoreID;
var allIDs = [];
$(window).on('load', function () {
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
          console.log(lowestHighscore, lowestHighscoreID, 'overhere');
          generateLeaderboard();
          injectLeaderboard();
        },
        error: function (request, textStatus, errorMessage) {
          console.log(errorMessage);
        }
      });

});

/*
function getLowestHighScore (highScores) {
    highScores.tasks.forEach(function (task) {
        //$('#todo-list').append('<p>' + task.content + '</p>');
        // secmaths;DAN;25
        var highScore = task.content.split(';');
        var lowestHighScore;
        var lowestHighScoreID;
        if(highScore[2] < lowestHighScore || !lowestHighScore) {
            lowestHighScoreID = task.id;
            lowestHighScore = highScore[2];
        }
      });
}
*/

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
    }
  });
}

/* New highscore is read and injected into DOM and last highscore is removed but only in current session
   need to clear all server highscores maybe? and post new updated leaderboard with new highscore
   and remove old one
*/
function updateLeaderboard () {
    $.ajax({
        type: 'POST',
        url: 'https://altcademy-to-do-list-api.herokuapp.com/tasks?api_key=213',
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify({
          task: {
            content: 'Do something fun'
          }
        }),
        success: function (response, textStatus) {
          console.log(response);
        },
        error: function (request, textStatus, errorMessage) {
          console.log(errorMessage);
        }
      });   
}

var postScore = function (score) {
  $.ajax({
    type: 'POST',
    url: 'https://altcademy-to-do-list-api.herokuapp.com/tasks?api_key=213',
    contentType: 'application/json',
    dataType: 'json',
    data: JSON.stringify({
      task: {
        content: score
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
        getAndDisplayAllTasks();
      },
      error: function (request, textStatus, errorMessage) {
        console.log(errorMessage);
      }
    });
  }

 $(document).on('click', '.delete', function () {
   deleteTask($(this).data('id'));
 });
