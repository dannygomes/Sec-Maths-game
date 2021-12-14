$(window).on('load', function () {
    $('#play-button').on('click', function () {
        $('#home').slideUp("slow");
    });

    $('#seconds').text(time);
    play(max);
    timeout = null;
    $('#result').on('keyup', function () {
        clearTimeout(timeout);
        timeout = setTimeout(checkResult, 250);
    });
});

var timer = setInterval(updateTimer, 1000);
const time = 10;
const max = 10;

function play (max) {
    $('#firstNumber').text(generateNumberUpTo(max));
    $('#secondNumber').text(generateNumberUpTo(max));
    $('#operator').text(setOperator());

    $('#result').focus();

}

function checkResult () {
    var result = $('#result').val();
    var firstNumber = Number($('#firstNumber').text());
    var secondNumber = Number($('#secondNumber').text());
    var correctAnswer = getAnswer();
    
    if(result == correctAnswer){
        clearInterval(timer);
        $('#seconds').text(Number($('#seconds').text()) < 10 ? Number($('#seconds').text()) + 1 : 10);
        timer = setInterval(updateTimer, 1000);
        play(max);
        $('#result').val('');
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
            if(Number($('#firstNumber').text()) < Number($('#secondNumber').text())){
                flipNumbers();
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
    }
}

function generateNumberUpTo(max) {
    var number = Math.floor(Math.random() * max);
    return number;
}

