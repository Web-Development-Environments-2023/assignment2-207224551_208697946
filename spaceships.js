var users = {};

function openTab(tabName) {
    var i;
    var x = document.getElementsByClassName("tab");
    for (i = 0; i < x.length; i++) {
        x[i].style.display = "none";
    }
    document.getElementById(tabName).style.display = "block";
}

function typing(textElement, text, index){

    textElement.style.whiteSpace = 'pre-wrap';

    if (index < text.length) {
        textElement.innerHTML += text.charAt(index);
        index++;
        setTimeout(function() { typing(textElement, text, index); }, 80);
    
    }
}

function aboutDialog(){
    var openDialogBtn = document.getElementById('open-dialog-btn');
    var closeDialogBtn = document.getElementById('close-dialog-btn');
    var myDialog = document.getElementById('my-dialog');
  
    // Open the dialog when the button is clicked
    openDialogBtn.addEventListener('click', function() {
      myDialog.showModal();
    });
  
    // Close the dialog when the close button is clicked
    closeDialogBtn.addEventListener('click', function() {
      myDialog.close();
    });

    document.addEventListener('click', function(event) {
        if (event.target === myDialog) {
          myDialog.close();
        }
    });
}

function date(){
    
    // Populate year select box
    var currentYear = new Date().getFullYear();
    var yearSelect = document.getElementById('year');
    for (var i = currentYear; i >= currentYear - 100; i--) {
      var option = document.createElement('option');
      option.value = i;
      option.text = i;
      yearSelect.appendChild(option);
    }
  
    // Populate day select box based on selected month and year
    var monthSelect = document.getElementById('month');
    var daySelect = document.getElementById('day');
    function populateDays() {
      var month = monthSelect.value;
      var year = yearSelect.value;
      daySelect.innerHTML = '';
      var daysInMonth = new Date(year, month, 0).getDate();
      for (var i = 1; i <= daysInMonth; i++) {
        var option = document.createElement('option');
        option.value = i;
        option.text = i;
        daySelect.appendChild(option);
      }
    }
  
    // Add event listeners to year and month select boxes
    yearSelect.addEventListener('change', populateDays);
    monthSelect.addEventListener('change', populateDays);
  
}

function containsNumber(text) {
    return /\d/.test(text);
  }
  
function containsLetterAndNumber(text) {
return /[a-zA-Z]/.test(text) && /\d/.test(text);
}
  
function validateEmail(email) {
// A simple regular expression for email validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
return emailRegex.test(email);
}

function register(event) {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm password').value;
    const firstName = document.getElementById('first name').value;
    const lastName = document.getElementById('last name').value;
    const email = document.getElementById('email').value;
    const year = document.getElementById('year').value;
    const month = document.getElementById('month').value;
    const day = document.getElementById('day').value;

    event.preventDefault();
  
    if (username === "" || password === "" || confirmPassword === "" || firstName === "" || lastName === "" || email === "" || year === "" || month === "" || day === "") {
      alert("Please fill all fields");
      return false;
    }
  
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return false;
    }
  
    if (!validateEmail(email)) {
      alert("Invalid email address");
      return false;
    }
  
    if (password.length < 8 || !containsLetterAndNumber(password)) {
      alert("Password must be at least 8 characters long and contain both letters and numbers");
      return false;
    }
  
    if (containsNumber(firstName) || containsNumber(lastName)) {
      alert("First and last name cannot contain numbers");
      return false;
    }

    users[username] = password;
    console.log(users)
    document.getElementById('register-form').reset();
    openTab('success-message');

    return true;
  }
  
function checkValidLogin(event){
    const username = document.getElementById('username2').value;
    const password = document.getElementById('password2').value;
    event.preventDefault();
    console.log(users)

    if( username=="p" && password=="testuser"){
        document.getElementById('login-form').reset();
        document.getElementById('menu').style.display = "none";
        openTab('Configuraiton');
        return true;
    }

    if (username in users){
        if (users[username] == password){
            document.getElementById('login-form').reset();
            document.getElementById('menu').style.display = "none";
            openTab('Configuraiton');
            return true;
        }
        else{
            alert("wrong password")
            return false;
        }
    }
    alert("no such a username")
    return false;

}


/////////GAME//////////

var canvas; // the canvas
var context; // used for drawing on the canvas

// constants for game play
var BAD_NUM = 20;
var TARGET_PIECES = 20; // sections in the target
var MISS_PENALTY = 2; // seconds deducted on a miss
var HIT_REWARD = 3; // seconds added on a hit
var TIME_INTERVAL = 25; // screen refresh interval in milliseconds
var LIVES = 3;
var COUNTER = 4;
var TIME_FOR_SPEED = 5;

// variables for the game loop and tracking statistics
var intervalTimer; // holds interval timer
var timerCount; // number of times the timer fired since the last second
var timeLeft; // the amount of time left in seconds
var shotsFired; // the number of shots the user has fired
var timeElapsed; // the number of seconds elapsed
var shot_key;
var score;
var scores = [];


var target; // start and end points of the target
var targetDistance; // target distance from left
var targetBeginning; // target distance from top
var targetEnd; // target bottom's distance from top
var pieceLength; // length of a target piece
var initialTargetVelocity; // initial target speed multiplier
var targetVelocity; // target speed multiplier during game


var bad;
var badImg;
var badImg1;
var badImg2;
var badImg3;
var rows;
var cols;
var startX;
var startY;


var goodImg;
var good;
var moveUp;
var moveDown;
var moveRight;
var moveLeft;


var lineWidth; // width of the target and blocker
var hitStates; // is each target piece hit?
var targetPiecesHit; // number of target pieces hit (out of 7)

// variables for the cannon and cannonball
var cannonball; // cannonball image's upper-left corner
var cannonballVelocity; // cannonball's velocity
var cannonballVelocityX;
var cannonballVelocityY;
var cannonballOnScreen; // is the cannonball on the screen
var cannonballRadius; // cannonball radius
var cannonballSpeed; // cannonball speed
var cannonBaseRadius; // cannon base radius
var cannonLength; // cannon barrel length
var barrelEnd; // the end point of the cannon's barrel
var canvasWidth; // width of the canvas
var canvasHeight; // height of the canvas

var badBall;
var badBall2;
var badballSpeed; 

var restart;

// variables for sounds
var hit_bad;
var cannonSound;
var blockerSound;
var game_music;
var hit_good;

// called when the app first launches
function setupGame()
{
   // stop timer if document unload event occurs
   document.addEventListener( "unload", stopTimer, false );

   // get the canvas, its context and setup its click event handler
   canvas = document.getElementById( "theCanvas" );
   context = canvas.getContext("2d");

   // start a new game when user clicks Start Game button
   document.getElementById( "start-btn" ).addEventListener( 
      "click", newGame, false );

   target = new Object(); // object representing target line
   target.start = new Object(); // will hold x-y coords of line start
   target.end = new Object(); // will hold x-y coords of line end
   cannonball = new Object(); // object representing cannonball point

   badBall = new Object();
   badBall2 = new Object();

   restart = document.getElementById( "restart" );


   bad = [];
   for (var i = 0; i < BAD_NUM; i++) {
            var spaceship = new Object();
            bad.push(spaceship);
        }
   badImg  = new Image();
   badImg.src = 'bad7.png';
   badImg.width = 80;
   badImg.height = 80;

   badImg1  = new Image();
   badImg1.src = 'bad1.png';
 
   badImg2  = new Image();
   badImg2.src = 'bad6.png';

   badImg3  = new Image();
   badImg3.src = 'bad8.png';

   rows = 4;
   cols = 5;


   good = new Object();
   goodImg = new Image();
   goodImg.src = 'logo.png'
   goodImg.width = 150;
   goodImg.height = 150;
   

   // initialize hitStates as an array
   hitStates = new Array(BAD_NUM);

   // get sounds
   hit_bad = document.getElementById( "hit_bad" );
   cannonSound = document.getElementById( "cannonSound" );
   blockerSound = document.getElementById( "blockerSound" );
   game_music = document.getElementById("game_music");
   hit_good = document.getElementById("hit_good");
   hit_good.volume = 1;
} // end function setupGame

// set up interval timer to update game
function startTimer()
{
   game_music.play();
   canvas.focus();
   canvas.addEventListener("keydown", function(event){
    console.log('Keydown event triggered:', event.code);
    if (event.key === shot_key){
          fireCannonball(event); // call the fireCannonball function to shoot the cannonball
        }
    if (event.code === 'ArrowUp') {
        moveUp = true;
        console.log(moveUp);
      } else if (event.code === 'ArrowDown') {
        moveDown = true;
      } else if (event.code === 'ArrowRight') {
        moveRight = true;
      } else if (event.code === 'ArrowLeft') {
        moveLeft = true;
      }
   });
//    canvas.addEventListener( "click", fireCannonball, false );

   restart.addEventListener("click", newGame);
   intervalTimer = window.setInterval( updatePositions, TIME_INTERVAL );
} // end function startTimer

// terminate interval timer
function stopTimer()
{
   canvas.removeEventListener( "click", fireCannonball, false );
   game_music.pause();
   window.clearInterval( intervalTimer );
   game_music.currentTime = 0;

} // end function stopTimer

// called by function newGame to scale the size of the game elements
// relative to the size of the canvas before the game begins
function resetElements()
{
   const dpr = window.devicePixelRatio || 1;
   canvas.width = window.innerWidth * dpr;
   canvas.height = window.innerHeight * dpr;
   context.scale(dpr, dpr);


   var w = canvas.width;
   var h = canvas.height;
   canvasWidth = w; // store the width
   canvasHeight = h; // store the height
   cannonBaseRadius = h / 18; // cannon base radius 1/18 canvas height
   cannonLength = w / 8; // cannon length 1/8 canvas width
   cannonballRadius = w / 90; // cannonball radius 1/36 canvas width
   cannonballSpeed = w * 3 / 2; // cannonball speed multiplier
   badballSpeed = w * 0.2;

   LIVES=3;
   score=0;
   startX =0;
   startY =0;
   var index = 0;
   for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      // calculate the x and y coordinates of the current spaceship
      var x = startX + col * badImg.width;
      var y = startY + row * badImg.height;
      bad[index].x = x;
      bad[index].y = y;
      bad[index].row = row;
      index++;
    }
  }
    var index = Math.floor(Math.random() * BAD_NUM);
    badBall.x = bad[index].x + (badImg.width / 2);
    badBall.y = bad[index].y + badImg.height;
    badBall2.x = bad[index].x + (badImg.width / 2);
    badBall2.y = bad[index].y + badImg.height;
    console.log('badBall:', badBall); 


   // configure instance variables related to the target
   targetDistance = w * 1 / 8; // target 7/8 canvas width from left
   targetBeginning = h / 10; // distance from top 1/8 canvas height
   targetEnd = w * 7/8; // distance from top 7/8 canvas height

   pieceLength = badImg.width;
   initialTargetVelocity = -h / 8; // initial target speed multiplier
   target.start.x = targetDistance;
   target.start.y = targetBeginning;
   target.end.x = targetEnd;
   target.end.y = targetBeginning;

   good.x = canvasWidth/2;
   good.y = canvasHeight * 6/8;

} // end function resetElements

// reset all the screen elements and start a new game
function newGame()
{
    shot_key = document.getElementById('shot').value;
    timeLeft = document.getElementById('minutes').value * 60;
    if(shot_key==="" || timeLeft==="" ){
        alert("Please fill all fields");
        return false;
    }
    else if(timeLeft< 120){
        alert("Minimum 2 minutes")
        return false;
    }

   openTab('Game');
   resetElements(); // reinitialize all game elements
   stopTimer(); // terminate previous interval timer


   // set every element of hitStates to false--restores target pieces
   for (var i = 0; i < BAD_NUM; ++i)
      hitStates[i] = false; // target piece not destroyed

   targetPiecesHit = 0; // no target pieces have been hit
   targetVelocity = initialTargetVelocity; // set initial velocity
   timerCount = 0; // the timer has fired 0 times so far
   cannonballOnScreen = false; // the cannonball is not on the screen
   shotsFired = 0; // set the initial number of shots fired
   timeElapsed = 0; // set the time elapsed to zero

   moveUp = false;
   moveDown= false;
   moveRight = false;
   moveLeft = false;

   startTimer(); // starts the game loop
   game_music.currentTime = 0;

} // end function newGame



// called every TIME_INTERVAL milliseconds
function updatePositions()
{
    var update = TIME_INTERVAL / 1000.0 * targetVelocity;
    for(var i =0; i< BAD_NUM ; i++){
        bad[i].x += update;
    }
    if(bad[0].x < 0 || bad[19].x > canvasWidth){
        targetVelocity *= -1; 
    }

    var interval2 = TIME_INTERVAL / 1000.0;
    badBall.x += interval2 * 0;
    badBall.y += interval2 * badballSpeed;
    badBall2.x += interval2 * 0;
    badBall2.y += interval2 * badballSpeed;

    if(badBall.y > canvasHeight * 3/4){
        badBall2.x = badBall.x
        badBall2.y = badBall.y
        var index = Math.floor(Math.random() * BAD_NUM);
        badBall.x = bad[index].x + (badImg.width / 2);
        badBall.y = bad[index].y + badImg.height;
    }

     //check for collision with bad ball
     if( badBall.x >= good.x && badBall.x <= good.x +goodImg.width && badBall.y >= good.y && 
        badBall.y <= good.y + goodImg.height ||badBall2.x >= good.x && badBall2.x <= good.x +goodImg.width 
        && badBall2.y >= good.y && badBall2.y <= good.y + goodImg.height ){
            hit_good.play();
            LIVES -= 1;
            good.x = canvasWidth/2;
            good.y = canvasHeight * 6/8;
            if (LIVES === 0){
                stopTimer();
                scores.push(score);
                showGameOverDialog("You lost"); // show the losing dialog
            }
        }

    const MOVE_DISTANCE = 60;

    if (moveUp == true && good.y > canvasHeight*0.6){
        good.y -= MOVE_DISTANCE;
        moveUp = false;
    }
    if (moveDown == true && good.y < canvasHeight){
        good.y += MOVE_DISTANCE;
        moveDown = false;
    }
    if (moveRight == true && good.x < canvas.width){
        good.x += MOVE_DISTANCE;
        moveRight = false;
    }
    if (moveLeft == true && good.x > 0){
        good.x -= MOVE_DISTANCE;
        moveLeft = false;
    }

   if (cannonballOnScreen) // if there is currently a shot fired
   {
      // update cannonball position
      var interval = TIME_INTERVAL / 1000.0;

      cannonball.x += interval * cannonballVelocityX;
      cannonball.y += interval * cannonballVelocityY;



      // check for collisions with top and bottom walls
      if (cannonball.y + cannonballRadius > canvasHeight || 
         cannonball.y - cannonballRadius < 0)
      {
         cannonballOnScreen = false; // make the cannonball disappear
      } // end else if
      
      //check for collision with bad spaceships
      for(var i =0; i < BAD_NUM; i++){
        if( cannonball.x >= bad[i].x && cannonball.x <= bad[i].x +badImg.width && cannonball.y >= bad[i].y && 
            cannonball.y <= bad[i].y + badImg.height  && !hitStates[i] ){
            hit_bad.play();
            hitStates[i] = true;
            cannonballOnScreen = false;
            score += (20 - bad[i].row * 5);
            if (++targetPiecesHit == TARGET_PIECES)
            {
               stopTimer(); // game over so stop the interval timer
               draw(); // draw the game pieces one final time
               scores.push(score);
               showGameOverDialog("Champion!"); // show winning dialog
            } // end if
            break;
        }
      }

    //   // check for cannonball collision with target
    //   if (cannonballVelocityX > 0 && 
    //      cannonball.x + cannonballRadius >= targetDistance &&
    //      cannonball.x + cannonballRadius <= targetDistance + lineWidth &&
    //      cannonball.y - cannonballRadius > target.start.y &&
    //      cannonball.y + cannonballRadius < target.end.y)
    //   {
    //      // determine target section number (0 is the top)
    //      var section = 
    //         Math.floor((cannonball.y  - target.start.y) / pieceLength);

    //      // check whether the piece hasn't been hit yet
    //      if ((section >= 0 && section < TARGET_PIECES) && 
    //         !hitStates[section])
    //      {
    //         targetSound.play(); // play target hit sound
    //         hitStates[section] = true; // section was hit
    //         cannonballOnScreen = false; // remove cannonball
    //         timeLeft += HIT_REWARD; // add reward to remaining time

    //         // if all pieces have been hit
    //         if (++targetPiecesHit == TARGET_PIECES)
    //         {
    //            stopTimer(); // game over so stop the interval timer
    //            draw(); // draw the game pieces one final time
    //            showGameOverDialog("You Won!"); // show winning dialog
    //         } // end if
    //      } // end if
    //   } // end else if
   } // end if

   ++timerCount; // increment the timer event counter

   // if one second has passed
   if (TIME_INTERVAL * timerCount >= 1000)
   {
      --timeLeft; // decrement the timer
      ++timeElapsed; // increment the time elapsed
      timerCount = 0; // reset the count

      if(--TIME_FOR_SPEED == 0 && COUNTER!= 0){
        targetVelocity = targetVelocity*1.5
        badballSpeed = badballSpeed*1.5
        TIME_FOR_SPEED =5;
        COUNTER -= 1;
      }
   } // end if

   draw(); // draw all elements at updated positions

   // if the timer reached zero
   if (timeLeft <= 0)
   {
      stopTimer();
      scores.push(score);
      if(score< 100){
        showGameOverDialog("You can do better"); 
      }
      else{
        showGameOverDialog("Winner!"); 
      }
   } // end if
} // end function updatePositions




// fires a cannonball
function fireCannonball(event)
{
   console.log("shot!");
   if (cannonballOnScreen) // if a cannonball is already on the screen
      return; // do nothing

   // move the cannonball to be inside the cannon
   cannonball.x = good.x + (goodImg.width/2); // align x-coordinate with cannon
   cannonball.y = good.y; // centers ball vertically

   // get the x component of the total velocity
   cannonballVelocityX = 0;

   // get the y component of the total velocity
   cannonballVelocityY = -cannonballSpeed;
   cannonballOnScreen = true; // the cannonball is on the screen
   ++shotsFired; // increment shotsFired

   // play cannon fired sound
//    cannonSound.play();
} // end function fireCannonball



// draws the game elements to the given Canvas
function draw()
{
    
   canvas.width = canvas.width; // clears the canvas (from W3C docs)

   // display time remaining
   context.fillStyle = "white";
   context.font = "30px Arial";
   context.textBaseline = "top";
   var minutes = Math.floor(timeLeft / 60);
   var seconds = timeLeft % 60;
   context.fillText("Time: " + minutes + ":" + (seconds < 10 ? "0" : "") + seconds, 5, 5);
   context.fillText("Lives: " + LIVES, 5, 45);
   context.fillText("Score: " + score, 5, 85);



   // if a cannonball is currently on the screen, draw it
   if (cannonballOnScreen)
   { 
      context.fillStyle = "gray";
      context.beginPath();
      context.arc(cannonball.x, cannonball.y, cannonballRadius, 0, Math.PI * 2);
      context.closePath();
      context.fill();
   } // end if

     // draw the cannonball on the canvas
     context.fillStyle = "red";
     context.beginPath();
     context.arc(badBall.x, badBall.y, cannonballRadius, 0, Math.PI * 2);
     context.closePath();
     context.fill();

      // draw the cannonball on the canvas
      context.fillStyle = "red";
      context.beginPath();
      context.arc(badBall2.x, badBall2.y, cannonballRadius, 0, Math.PI * 2);
      context.closePath();
      context.fill();

   // draw the good spaceship
   context.drawImage(goodImg, good.x, good.y, goodImg.width, goodImg.height);

   for(var i=0; i< BAD_NUM; i++){
        if (hitStates[i] == true){
            continue;
        }
        if ( bad[i].row == 0){
            context.drawImage(badImg2, bad[i].x, bad[i].y, badImg.width, badImg.height);

        }
        else if(bad[i].row == 1){
            context.drawImage(badImg1, bad[i].x, bad[i].y, badImg.width, badImg.height);

        }
        else if(bad[i].row== 3){
          context.drawImage(badImg3, bad[i].x, bad[i].y, badImg.width, badImg.height);
        }
        else{
            context.drawImage(badImg, bad[i].x, bad[i].y, badImg.width, badImg.height);
        } 
   }


//    // initialize currentPoint to the starting point of the target
//    var currentPoint = new Object();
//    currentPoint.x = target.start.x;
//    currentPoint.y = target.start.y; 

//    // draw the target
//    for(var j=0; j<4; ++j){

//         for (var i = 0; i < TARGET_PIECES/4; ++i)
//         {
//         // if this target piece is not hit, draw it
//         if (!hitStates[i])
//         {
//             context.drawImage(img, currentPoint.x, currentPoint.y, 10, 20);
//         } // end if
        
//         // move currentPoint to the start of the next piece
//         currentPoint.x += pieceLength;
//         } // end for
//         currentPoint.y += img.height;
//         currentPoint.x = target.start.x;
//    }
   
} // end function draw


// display an alert when the game ends

function showGameOverDialog(message)
{
  console.log("dialog");
  var dialog = document.getElementById("game-over-dialog");
  var scoreElement = document.getElementById("score");
  var messageElement = document.getElementById("message");
  var scoresElement = document.getElementById("scores");

  messageElement.textContent = message;
  scoreElement.textContent = score;
  scoresElement.innerHTML = ""; // clear existing scores
  scores.sort(function(a, b){return b-a});
  var ul = document.createElement("ul");
  for (var i = 0; i < scores.length; i++) {
    var li = document.createElement("li");
    li.textContent = scores[i];
    ul.appendChild(li);
  }
  scoresElement.appendChild(ul);
  dialog.showModal();
  // Close the dialog when the close button is clicked
  closebtn = document.getElementById("close-dialog");
  closebtn.addEventListener('click', function() {
        dialog.close();
      });


  //  alert(message + "\nShots fired: " + shotsFired + 
  //     "\nTotal time: " + timeElapsed + " seconds ");
} // end function showGameOverDialog

function exitGame(){
  stopTimer();
  scores = [];
  document.getElementById('menu').style.display = "block";
  openTab('Welcome')
}

window.addEventListener("load", setupGame, false);


