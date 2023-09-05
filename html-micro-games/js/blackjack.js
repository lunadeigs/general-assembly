//Color schemes from https://visme.co/blog/website-color-schemes/

const cards = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
const suits = ['C', 'D', 'H', 'S'];
const colors = ['blue', 'gray', 'green', 'purple', 'red', 'yellow'];

let playerBust = false;
let dealerBust = false;
let currentColor = 'red';


const deal = () => { //Deals Cards to Player and Dealer
    playerBust = false;
    dealerBust = false;
    $('#deal').remove(); //Removes Deal Button
    playerDeal();
    dealerInitialDeal();
    addHitStayButtons();
}

const addHitStayButtons = () => { //Adds hit and stay buttons to the page
    let $hitButton = $('<button>').text('Hit').attr('id', 'hit').addClass('glow-on-hover');
    $hitButton.on('click', hit);

    let $stayButton = $('<button>').text('Stay').attr('id', 'stay').addClass('glow-on-hover');
    $stayButton.on('click', stay);

    $('#buttons').append($hitButton, $stayButton);
}

const playerDeal = () => { //Deals 2 cards to the player
    let randomCard = cards[Math.floor(Math.random()*12)];
    let randomSuit = suits[Math.floor(Math.random()*4)];
    let $cardOne = $('<img>').attr('src', `./Cards/${randomCard}${randomSuit}.png`).addClass('card').attr('id', randomCard);

    randomCard = cards[Math.floor(Math.random()*12)];
    randomSuit = suits[Math.floor(Math.random()*4)];
    let $cardTwo = $('<img>').attr('src', `./Cards/${randomCard}${randomSuit}.png`).addClass('card').attr('id', randomCard);

    $('#playerCards').append($cardOne, $cardTwo);
}

const dealerInitialDeal = () => { //Deals the initial 2 cards to the dealer
    let randomCard = cards[Math.floor(Math.random()*12)];
    let randomSuit = suits[Math.floor(Math.random()*4)];
    let $dealerCardOne = $('<img>').attr('src', `./Cards/${randomCard}${randomSuit}.png`).addClass('card').attr('id', randomCard);

    randomCard = cards[Math.floor(Math.random()*12)];
    randomSuit = suits[Math.floor(Math.random()*4)];
    let $dealerCardTwo = $('<img>').attr('src', `./Cards/${currentColor}_back.png`).addClass('cardBack').attr('id', randomCard);

    $('#dealerCards').append($dealerCardOne, $dealerCardTwo);
}

const dealerPlay = () => { //Deals cards until the dealer hits 17 or higher
    showDealer();
    while(calculate($('#dealerCards')) < 17){
        let randomCard = cards[Math.floor(Math.random()*12)];
        let randomSuit = suits[Math.floor(Math.random()*4)];
        let $dealerCard = $('<img>').attr('src', `./Cards/${randomCard}${randomSuit}.png`).addClass('card').attr('id', randomCard);
        $('#dealerCards').append($dealerCard);
    }
    if(calculate($('#dealerCards')) > 21){
        dealerBust = true;
    }
}

const hit = () => { //hits the player with another card if they haven't already bust
    if(!playerBust){
        let randomCard = cards[Math.floor(Math.random()*12)];
        let randomSuit = suits[Math.floor(Math.random()*4)];
        let $card = $('<img>').attr('src', `./Cards/${randomCard}${randomSuit}.png`).addClass('card').attr('id', randomCard);

        $('#playerCards').append($card);
        if(calculate($('#playerCards')) > 21){ //Busts if the player is over 21
            playerBust = true;
            showDealer();
            showWinner();
            reset();
        }
    }
}

const showDealer = () => { //Reveals the dealers cards that are currently hidden
    let randomSuit = suits[Math.floor(Math.random()*4)];
    console.log($('#dealerCards').children());
    for(let item of ($('#dealerCards').children())){
        $(item).removeClass('cardBack').addClass('card').attr('src', `./Cards/${$(item).attr('id')}${randomSuit}.png`);
    }
}

const reset = () => { //Resets the game and adds a deal button 
    $('#hit').remove();
    $('#stay').remove();

    let $deal = $('<button>').text('Deal').attr('id', 'deal');
    $deal.on('click', () => {
        $('#winner').remove();
        $('.card').remove();
        $('.cardBack').remove();
        deal();
    });
    $('#buttons').append($deal);
}

const showWinner = () => { //Displays the winnner on the screen using the calcWin function
    let winner = calcWin();
    let $winnerCard;

    if(winner === 'tie'){
        $winnerCard = $('<h2>').text(`Its a tie!`).attr('id', 'winner');
    }else{
        $winnerCard = $('<h2>').text(`The ${winner} is the winner!`).attr('id', 'winner');
    }

    increaseBlackjackWins(winner);
    
    $('#winnerCard').append($winnerCard);
}

const stay = () => { //Needs to be refactored into different functions
    if(!playerBust){
        dealerPlay();
    }else{
        showDealer();
    }
    showWinner();
    reset();
}

const calculate = (cardStack) => { //Calculates the total in a cardStack (player or dealer) and returns the current score of the hand
    $cardDivs = cardStack.children()
    let max = 0;
    let min = 0;
    let actualScore = 0;
    for(let item of $cardDivs){
        let itemId = $(item).attr('id');
        if(itemId === 'K' || itemId === 'Q' || itemId === 'J'){
            max += 10;
            min += 10;
        }else if (itemId === 'A'){
            max += 11;
            min += 1;
        }else{
            max += parseInt(itemId);
            min += parseInt(itemId);
        }
    }
    if(max <= 21){
        return max;
    }else{
        return min;
    }
}

const calcWin = () => { //Calculates who the winner is and returns them
    if(dealerBust && !playerBust){
        return 'player';
    }else if (!dealerBust && playerBust){
        return 'dealer'
    }else if(calculate($('#playerCards')) > calculate($('#dealerCards'))){
        return 'player';
    }else if(calculate($('#playerCards')) === calculate($('#dealerCards'))){
        return 'tie';
    }else{
        return 'dealer';
    }
}

$(() => {
    $('#deal').on('click', deal); //Sets up the deal button
});