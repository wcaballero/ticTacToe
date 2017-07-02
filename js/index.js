//2nd attempt at minimax
/*Using the minimax algorithm for the computer ai
* tic tac toe challenge part of freecodecamps advanced front end projects*/
var resetBtn = document.getElementById('reset');
var locations = document.getElementsByClassName('location');
//the html board is numbered weird so when it is grabbed by locations it is out of order
//linkIndex links the gameBoard and locations[linkIndex] from 0-8 and 1-9
var linkIndex = [0, 3, 6, 1, 4, 7, 2, 5, 8]; //locations id is out of order so need to do a fix
var gameBoard = [0, 0, 0, 0, 0, 0, 0, 0, 0];
var dummyBoard = [0, 0, 0, 0, 0, 0, 0, 0, 0];
var human = "X";
var computer = "P";
var gameOver = false;
var humanScore = document.getElementById('playerScore');
var computerScore = document.getElementById('computerScore');
//Reset the game
resetBtn.addEventListener("click", function(){
  gameOver = false;
  gameBoard = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  dummyBoard = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  //reset visual board
  for(var i=0; i<locations.length; i++)
    locations[i].children[0].className = "open";
});// end resetBtn
//Everytime a tile is clicked it runs a parallel computer AI
for(var i=0; i < locations.length; i++){
  locations[i].addEventListener("click", function(){
    if(gameOver === false){
      //human clicks it adds their marker
      addMarker(human, this);
      if(checkWin(human, gameBoard)){
        gameOver = true;
        incrementScore(humanScore);
        alert("Well done human!");
        return;
      }
      //check for a draw by checking if gameBoard is empty
      if(isEmpty(gameBoard)){
        gameOver = true;
        alert("Touché, it's a DRAW");
        return;
      }
      //Computers turn this includes a branch to minimax
      computerController(gameBoard.slice(0,9), computer );
      /* Checking the index of the max score in dummyBoard to put the computers choice
       * It is also checking to make sure that the index is not occupied*/
      var index = 0; //based on the gameboard
      var max = dummyBoard[0];
      for(var i=0; i<dummyBoard.length; i++){
        // console.log("dummyBoard["+i+"]: "+dummyBoard[i]+ " max: " + max+ " index: "+index);
        if(parseInt(dummyBoard[i]) > max && gameBoard[i] === 0){
          max = dummyBoard[i];
          index = i;
        }
        else if(parseInt(dummyBoard[i]) === max && gameBoard[i] === 0){
          max = dummyBoard[i];
          index = i;
        }
      }
      addMarker(computer, locations[linkIndex[index]]);
      //reset dummyBoard for ai to determine next position
      for(var i=0; i<dummyBoard.length; i++){
        dummyBoard[i] = 0;
      }
      if(checkWin(computer, gameBoard)){
        gameOver = true;
        incrementScore(computerScore);
        alert("Computer wins!");
        return;
      }
    }
  }); //end of EventListeners
} //end of forEach

//function to add a human marker
//can pass the index/id as the location
function addMarker(player, location){
  location.children[0].innerHTML = player;
  //remove class open to allow visual
  location.children[0].className = "";
  //update gameBoard
  gameBoard[location.id-1] = player;
}

//Returns boolean to check if their is a winner
//function checks the javascript boards
function checkWin(player, board){
  var winner = false;
  //check rows
  for(var i=0; i<=6; i+=3)
    if(board[i] === player && board[i+1] === player && board[i+2] === player)
      winner = true;
  //checks cols
  for(var i=0; i<3; i++)
    if(board[i] === player && board[i+3] === player && board[i+6] === player)
      winner = true;
  //check diags
  if(board[0] === player && board[4] === player && board[8] === player)
    winner = true;
  if(board[2] === player && board[4] === player && board[6] === player)
    winner = true;
  return winner;
}

//boolean to check for a draw
//checks for empty spots in the gameBoard
function isEmpty(board){
  var result = true;
  board.forEach(function(elem){
    if(elem === 0)
      result = false; //board is not empty
  });
  return result;
}

//function used to increment score
//takes in an object and updates that object
function incrementScore(scoreObj){
  var currScore = parseInt(scoreObj.innerHTML);
  currScore++;
  scoreObj.innerHTML = currScore;
}

//function to control the computer ai Nextmove based on minimax algorithm
function computerController(board, player){
  for(var i=0; i <9; i++){
    if (board[i] === 0){
      board[i] = player; //init setting 1st avail to computer
      //run minimax to check if it is a good move
      dummyBoard[i] = minimax(board.slice(0,9), player);
      if(checkWin(player, board) && player == computer){
        dummyBoard[i]+=1000000;
      }
      board[i] = 0; //reset the position and check again
    }
  }
  return;
} //end of computer ai

//minimax algorithm to determine best move for the computer
function minimax(board, player){
  player == human ? player = computer : player = human;
  var score = 0;
  //check if computer is winning
  for (var i=0; i<9; i++){
    if(board[i] === 0){
      //end states
      board[i] = player;
      if(checkWin(player, board) && player == human){
       score -= 10;
        continue;
      }
      if (checkWin(player, board) && player == computer){
       score += 10;
        continue;
      }
      if(player == human){
        score += minimax(board.slice(0,9), human);
      } else {
        score += minimax(board.slice(0,9), computer);
      }
      board[i] = 0;
    }
  }
  return score;
} //end of minimax
