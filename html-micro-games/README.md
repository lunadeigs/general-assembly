# Blackjack and Simon Says App
### By Luna Deighan

This application consists of two parts, the first being a blackjack application, and the second being Simon Says.
All attributions are listed in the code comments as well as at the bottom of the README.
[Link to Project](./home.html)

## Blackjack Application

The Blackjack application is a simple game of blackjack where the player faces off against the dealer. The player is first faced with the option to deal, which will deal the dealer 2 cards, one face up and one face down, and then gives the player two cards face up (in a normal game these would be face down for only the player to see but for application simplicity the cards are face up).
After dealing, the player is faced with 2 options, hit or stay. On a hit, the game will deal the player a face up card. If this card makes the total of the players hand go over 21, the player will bust and the dealer will automatically win without taking their turn, however if they do not go over 21, they are faced with the same option to hit or stay.
On a stay, the player stops taking cards and the total of their hand is counted. The dealer then takes their turn, where if the total of their hand is under 17, they are dealt another card, and if it is 17 or over, their turn ends and the totals between the two hands are compared.
First, the game checks to see if either the player of the dealer has bust, and if not it compares the totals of the hands. Whoever has a greater total will then be the winner of the hand and the player is once again faced with a deal button.

#### Technical Aspects

This game functions using by storing the value of each card into the DOM and then using jquery to perform operations on each hand as a pseudo-object. Each card is an img tag with an id of its given value built on the javascript end as seen in the code. Upon winning, the game also uses the home.js file to update the scoreboard with a new win and then store that data to localStorage.

## Simon Says

The Simon Says application is exactly what it sounds, a game of simon says. The game randomly generates a number 1 through 4 and then lights up a button of the corresponding color. The player then must repeat the button press to continue to the next round. Upon completing each round, the game will add a new button press to the sequence, making the game increasingly more complex as it continues. The game will continue until the player messes up the pattern and they are then asked to play again.

#### Technical Aspects

The game randomly generates a number 1-4 and then locates the id in the dom of the corresponding color and changes its color to a lighter version of the color (i.e. blue becomes light blue etc.). The game then attatches event listeners to each button to allow the user to interact with the buttons, and after the number of buttons that needs to be pressed are pressed (i.e. round 2 has 2 buttons pressed), the event listeners are removed.
The game makes 2 arrays, one for the true combination and one for the players combination, the first one is populated by the computer and the second by the player's key presses. After each array is populated, they are compared, and if they are the same, the game continues, and if not, the game ends allowing the player to play again.


### Sources Cited
https://visme.co/blog/website-color-schemes/
Creaticca Creative Agency, GB on theNounProject
Kocsten on codepen
http://jsfiddle.net/mitrosin/xb9edv64/
https://jeopardylabs.com/play/computer-science-1012
https://medium.com/@ericschwartz7/adding-audio-to-your-app-with-jquery-fa96b99dfa97
Zapsplat, freeSoundLibrary, and freesound.org
Pexels.com