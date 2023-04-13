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
function exit(){
    document.getElementById('menu').style.display = "block";
    openTab('Welcome')
}

/////////GAME//////////

var canvas; // the canvas
var context; // used for drawing on the canvas

// constants for game play
var TARGET_PIECES = 20; // sections in the target
var MISS_PENALTY = 2; // seconds deducted on a miss
var HIT_REWARD = 3; // seconds added on a hit
var TIME_INTERVAL = 25; // screen refresh interval in milliseconds

// variables for the game loop and tracking statistics
var intervalTimer; // holds interval timer
var timerCount; // number of times the timer fired since the last second
var timeLeft; // the amount of time left in seconds
var shotsFired; // the number of shots the user has fired
var timeElapsed; // the number of seconds elapsed
var shot_key;


var target; // start and end points of the target
var targetDistance; // target distance from left
var targetBeginning; // target distance from top
var targetEnd; // target bottom's distance from top
var pieceLength; // length of a target piece
var initialTargetVelocity; // initial target speed multiplier
var targetVelocity; // target speed multiplier during game
var img;


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
var cannonballOnScreen; // is the cannonball on the screen
var cannonballRadius; // cannonball radius
var cannonballSpeed; // cannonball speed
var cannonBaseRadius; // cannon base radius
var cannonLength; // cannon barrel length
var barrelEnd; // the end point of the cannon's barrel
var canvasWidth; // width of the canvas
var canvasHeight; // height of the canvas

// variables for sounds
var targetSound;
var cannonSound;
var blockerSound;

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
   img  = new Image();
   img.src = 'bad.png';

   good = new Object();
   goodImg = new Image();
   goodImg.src = 'logo.png'

   // initialize hitStates as an array
   hitStates = new Array(TARGET_PIECES);

   // get sounds
   targetSound = document.getElementById( "targetSound" );
   cannonSound = document.getElementById( "cannonSound" );
   blockerSound = document.getElementById( "blockerSound" );
} // end function setupGame

// set up interval timer to update game
function startTimer()
{
   canvas.focus();
   canvas.addEventListener("keydown", function(event){
    console.log('Keydown event triggered:', event.code);

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
   canvas.addEventListener( "click", fireCannonball, false );
   intervalTimer = window.setInterval( updatePositions, TIME_INTERVAL );
} // end function startTimer

// terminate interval timer
function stopTimer()
{
   canvas.removeEventListener( "click", fireCannonball, false );
   window.clearInterval( intervalTimer );
} // end function stopTimer

// called by function newGame to scale the size of the game elements
// relative to the size of the canvas before the game begins
function resetElements()
{
   var w = canvas.width;
   var h = canvas.height;
   canvasWidth = w; // store the width
   canvasHeight = h; // store the height
   cannonBaseRadius = h / 18; // cannon base radius 1/18 canvas height
   cannonLength = w / 8; // cannon length 1/8 canvas width

   cannonballRadius = w / 36; // cannonball radius 1/36 canvas width
   cannonballSpeed = w * 3 / 2; // cannonball speed multiplier

   lineWidth = w / 24; // target and blocker 1/24 canvas width


   // configure instance variables related to the target
   targetDistance = w * 1 / 8; // target 7/8 canvas width from left
   targetBeginning = h / 10; // distance from top 1/8 canvas height
   targetEnd = w * 7/8; // distance from top 7/8 canvas height
   img.width = 10;
   img.height = 10;
   pieceLength = img.width;
   initialTargetVelocity = -h / 4; // initial target speed multiplier
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

   openTab('Game');
   shot_key = document.getElementById('shot').value;
   const timeout = document.getElementById('minutes').value;
   console.log(shot_key);
   resetElements(); // reinitialize all game elements
   stopTimer(); // terminate previous interval timer

   // set every element of hitStates to false--restores target pieces
   for (var i = 0; i < TARGET_PIECES; ++i)
      hitStates[i] = false; // target piece not destroyed

   targetPiecesHit = 0; // no target pieces have been hit
   targetVelocity = initialTargetVelocity; // set initial velocity
   timeLeft = 10; // start the countdown at 10 seconds
   timerCount = 0; // the timer has fired 0 times so far
   cannonballOnScreen = false; // the cannonball is not on the screen
   shotsFired = 0; // set the initial number of shots fired
   timeElapsed = 0; // set the time elapsed to zero

   moveUp = false;
   moveDown= false;
   moveRight = false;
   moveLeft = false;

   startTimer(); // starts the game loop
} // end function newGame

// called every TIME_INTERVAL milliseconds
function updatePositions()
{

   // update the target's position
   var targetUpdate = TIME_INTERVAL / 1000.0 * targetVelocity;
   target.start.x += targetUpdate;
   target.end.x += targetUpdate;

   // if the target hit the top or bottom, reverse direction
   if (target.start.x < 0 || target.end.x > canvasWidth)
      targetVelocity *= -1;
    
    const MOVE_DISTANCE = 20;

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

      // check for collision with blocker
      if ( cannonballVelocityX > 0 )
      {
         blockerSound.play(); // play blocker hit sound
         cannonballVelocityX *= -1; // reverse cannonball's direction
         timeLeft -= MISS_PENALTY; // penalize the user
      } // end if

      // check for collisions with left and right walls
      else if (cannonball.x + cannonballRadius > canvasWidth || 
         cannonball.x - cannonballRadius < 0)
      {
         cannonballOnScreen = false; // remove cannonball from screen
      } // end else if

      // check for collisions with top and bottom walls
      else if (cannonball.y + cannonballRadius > canvasHeight || 
         cannonball.y - cannonballRadius < 0)
      {
         cannonballOnScreen = false; // make the cannonball disappear
      } // end else if

      // check for cannonball collision with target
      else if (cannonballVelocityX > 0 && 
         cannonball.x + cannonballRadius >= targetDistance &&
         cannonball.x + cannonballRadius <= targetDistance + lineWidth &&
         cannonball.y - cannonballRadius > target.start.y &&
         cannonball.y + cannonballRadius < target.end.y)
      {
         // determine target section number (0 is the top)
         var section = 
            Math.floor((cannonball.y  - target.start.y) / pieceLength);

         // check whether the piece hasn't been hit yet
         if ((section >= 0 && section < TARGET_PIECES) && 
            !hitStates[section])
         {
            targetSound.play(); // play target hit sound
            hitStates[section] = true; // section was hit
            cannonballOnScreen = false; // remove cannonball
            timeLeft += HIT_REWARD; // add reward to remaining time

            // if all pieces have been hit
            if (++targetPiecesHit == TARGET_PIECES)
            {
               stopTimer(); // game over so stop the interval timer
               draw(); // draw the game pieces one final time
               showGameOverDialog("You Won!"); // show winning dialog
            } // end if
         } // end if
      } // end else if
   } // end if

   ++timerCount; // increment the timer event counter

   // if one second has passed
   if (TIME_INTERVAL * timerCount >= 1000)
   {
      --timeLeft; // decrement the timer
      ++timeElapsed; // increment the time elapsed
      timerCount = 0; // reset the count
   } // end if

   draw(); // draw all elements at updated positions

   // if the timer reached zero
   if (timeLeft <= 0)
   {
      stopTimer();
      showGameOverDialog("You lost"); // show the losing dialog
   } // end if
} // end function updatePositions


function move(event){

}


// fires a cannonball
function fireCannonball(event)
{
   if (cannonballOnScreen) // if a cannonball is already on the screen
      return; // do nothing

   var angle = alignCannon(event); // get the cannon barrel's angle

   // move the cannonball to be inside the cannon
   cannonball.x = cannonballRadius; // align x-coordinate with cannon
   cannonball.y = canvasHeight / 2; // centers ball vertically

   // get the x component of the total velocity
   cannonballVelocityX = (cannonballSpeed * Math.sin(angle)).toFixed(0);

   // get the y component of the total velocity
   cannonballVelocityY = (-cannonballSpeed * Math.cos(angle)).toFixed(0);
   cannonballOnScreen = true; // the cannonball is on the screen
   ++shotsFired; // increment shotsFired

   // play cannon fired sound
   cannonSound.play();
} // end function fireCannonball

// aligns the cannon in response to a mouse click
function alignCannon(event)
{
   // get the location of the click 
   var clickPoint = new Object();
   clickPoint.x = event.clientX;
   clickPoint.y = event.clientY;

   // compute the click's distance from center of the screen
   // on the y-axis
   var centerMinusY = (canvasHeight / 2 - clickPoint.y);

   var angle = 0; // initialize angle to 0

   // calculate the angle the barrel makes with the horizontal
   if (centerMinusY !== 0) // prevent division by 0
      angle = Math.atan(clickPoint.x / centerMinusY);

   // if the click is on the lower half of the screen
   if (clickPoint.y > canvasHeight / 2)
      angle += Math.PI; // adjust the angle

   // calculate the end point of the cannon's barrel
//    barrelEnd.x = (cannonLength * Math.sin(angle)).toFixed(0);
//    barrelEnd.y = 
//       (-cannonLength * Math.cos(angle) + canvasHeight / 2).toFixed(0);

   return angle; // return the computed angle
} // end function alignCannon

// draws the game elements to the given Canvas
function draw()
{
   canvas.width = canvas.width; // clears the canvas (from W3C docs)

   // display time remaining
   context.fillStyle = "black";
   context.font = "bold 24px serif";
   context.textBaseline = "top";
   context.fillText("Time remaining: " + timeLeft, 5, 5);

   // if a cannonball is currently on the screen, draw it
   if (cannonballOnScreen)
   { 
      context.fillStyle = "gray";
      context.beginPath();
      context.arc(cannonball.x, cannonball.y, cannonballRadius, 
         0, Math.PI * 2);
      context.closePath();
      context.fill();
   } // end if

   // draw the good spaceship
   context.drawImage(goodImg, good.x, good.y, 20, 20);


   // initialize currentPoint to the starting point of the target
   var currentPoint = new Object();
   currentPoint.x = target.start.x;
   currentPoint.y = target.start.y; 

   // draw the target
   for(var j=0; j<4; ++j){

        for (var i = 0; i < TARGET_PIECES/4; ++i)
        {
        // if this target piece is not hit, draw it
        if (!hitStates[i])
        {
            context.drawImage(img, currentPoint.x, currentPoint.y, 10, 20);
        } // end if
        
        // move currentPoint to the start of the next piece
        currentPoint.x += pieceLength;
        } // end for
        currentPoint.y += img.height;
        currentPoint.x = target.start.x;
   }
   
} // end function draw

// display an alert when the game ends
function showGameOverDialog(message)
{
   alert(message + "\nShots fired: " + shotsFired + 
      "\nTotal time: " + timeElapsed + " seconds ");
} // end function showGameOverDialog

window.addEventListener("load", setupGame, false);


