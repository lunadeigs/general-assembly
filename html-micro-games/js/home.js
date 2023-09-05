let blackjackWins = localStorage.getItem('blackjackWins');
let simonSaysScore = localStorage.getItem('simonSaysScore');

if(simonSaysScore == null){
    simonSaysScore = 0;
}

if(blackjackWins == null){
    blackjackWins = 0;
}

increaseBlackjackWins = (winner) => {
    if(winner === 'player'){
        blackjackWins++;
        localStorage.setItem('blackjackWins', blackjackWins);
    }
    updateScoreboard();
}

setSimonSaysHighScore = (score) => {
    console.log(score);
    if(score > simonSaysScore){
        simonSaysScore = score;
        localStorage.setItem('simonSaysScore', simonSaysScore);
    }
    updateScoreboard();
}

updateScoreboard = () => {
    $('#blackjackWins').text('Blackjack Wins: ' + blackjackWins);
    $('#simonSaysHigh').text('Simon Says High Score: ' + simonSaysScore);
}

$( () => {
    $('.popoutButton').hide();
    updateScoreboard(); 
});