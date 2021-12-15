var max;
var timer = null;

$(window).on('load', function () {
    $(".hidden").hide().removeClass("hidden");
    playButton();

    
    $('#start-button').on('click', function () {
        if($('#max-value').val() < 0){
            alert("I don't like negative numbers, sorry. Try again!");
        } else {
            max = $('#max-value').val();

            $('#max-value-select').slideUp();
            $('#play').slideDown();
            play(max);
        }
 
    });

    $('#seconds').text(10);

    var timeout;
    $('#result').on('keyup', function () {
        if(!timer){
            //Realized i have to set interval only once and not on every key up
            timer = setInterval(updateTimer, 1000);
        }
        clearTimeout(timeout);
        timeout = setTimeout(checkResult, 250);
    });
});

function playButton () {
    $('#play-button').on('click', function () {
        $('#home').slideUp();
        $('#max-value-select').slideDown();
    });

    $('.back-button').on('click', function () {
        $('#max-value-select').slideUp();
        $('#home').slideDown();
    });
}


function play (max) {
    $('#firstNumber').text(generateNumberUpTo(max));
    $('#secondNumber').text(generateNumberUpTo(max));
    $('#operator').text(setOperator());

    $('#result').focus();
}

function checkResult () {
    var result = $('#result').val();
    var correctAnswer = getAnswer();
    
    if(result == correctAnswer){
        $('#seconds').text(Number($('#seconds').text()) < 10 ? Number($('#seconds').text()) + 1 : 10);
        play(max);
        $('#result').val('');
        $('#score').text(Number($('#score').text()) + 1);
    } else {
        $('#result').val('');
    }
}

function getAnswer () {
    var firstNumber = Number($('#firstNumber').text());
    var secondNumber = Number($('#secondNumber').text());
    var operator = $('#operator').text();

    switch(operator){
        case '+':
            return firstNumber + secondNumber;
        case '-':
            return firstNumber - secondNumber;
        case 'x':
            return firstNumber * secondNumber;
        case '/':
            return Math.floor(firstNumber / secondNumber);    
        default:
            return 0;            
    }
}

function setOperator() {
    var determineOperator = generateNumberUpTo(4);

    switch(determineOperator){
        case 0:
            $('#operator').text('+');
            break;
        case 1:
            $('#operator').text('-');
            if(Number($('#firstNumber').text()) < Number($('#secondNumber').text())){
                flipNumbers();
            }
            break;
        case 2:
            $('#operator').text('x'); 
            break;
        case 3:
            $('#operator').text('/'); 
            console.log(Number($('#secondNumber').text()) == 0);
            if(Number($('#firstNumber').text()) < Number($('#secondNumber').text())){
                flipNumbers();
            } 
            if(Number($('#secondNumber').text()) == 0){
                $('#secondNumber').text('1');
            }
            break;
        default:
            $('#operator').text('?');   
            break;
    }
}

function flipNumbers() {
    var aux = $('#firstNumber').text();
    console.log(aux);
    $('#firstNumber').text($('#secondNumber').text());
    $('#secondNumber').text(aux);
}

function updateTimer () {
    if(Number($('#seconds').text()) > 0){
        $('#seconds').text(Number( $('#seconds').text()) - 1);
    } else {
        $('#seconds').text('0');
        clearInterval(timer);
        timer = null;
        gameOver();
    }
}

function generateNumberUpTo(max) {
    var number = Math.floor(Math.random() * max);
    return number;
}

function gameOver () {
    $('#play').slideUp();
    $('#game-over').slideDown();
    $('#seconds').text('10');
    $('#score').text('0');

    $('.home-button').on('click', function () {
        $('#game-over').slideUp();
        $('#home').slideDown();
    });

    $('.try-again-button').on('click', function () {
        $('#game-over').slideUp();
        $('#play').slideDown();
        play(max);
    })
}

