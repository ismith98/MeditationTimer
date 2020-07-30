
var submit = document.querySelector("#submit");
var duration = document.querySelector("#duration");
var durationErrMsg = document.querySelector("#durationErrMsg");
var warmup = document.querySelector("#warmup");
let warmupErrMsg = document.querySelector("#warmupErrMsg");
var startingBell = document.querySelector("#startingBell");
var endingBell = document.querySelector("#endingBell");
var form = document.querySelector("form");
var container = document.querySelector(".container");
var title = document.querySelector("#title");
var countdown = document.querySelector("#countdown");
var pause = document.querySelector(".button.pause");
var play = document.querySelector(".button.play");

var finish = document.querySelector("#finish");

var timerStats = {};
var countdownInterval;

// 1 second = 1000ms
const ONE_SECOND = 1000;
const INPUT_ERR_MSG = "Must be a whole number greater than 0";

submit.addEventListener("click", startTimer);

pause.addEventListener("click", ()=> {endInterval();  togglePauseScreen() });
play.addEventListener("click", ()=> {startInterval();  togglePauseScreen() } );


finish.addEventListener("click", displayForm);

function removeInputErrMsg(inputElement, errMsgElement){

	errMsgElement.innerText = "";
	inputElement.style.border = "2px solid #ccc";
	inputElement.removeEventListener("input", () => removeInputErrMsg(inputElement, errMsgElement));
}

function validateFields() {
	// Only accept whole numbers
	let pattern = new RegExp("^\\d+$");
	let valid = true;
	
	// Test the duration field
	if(!pattern.test(duration.value) || duration.value == 0 ) {
		// Show the error message and make the border red
		durationErrMsg.innerText = INPUT_ERR_MSG;
		duration.style.border = "2px solid red";
		
		// When the input is changed, remove the error message
		duration.addEventListener("input", () => removeInputErrMsg(duration, durationErrMsg));
		valid = false;
	}
		
	// Test the warmup field
	if(!pattern.test(warmup.value) || warmup.value == 0 ) {
		// Show the error message and make the border red
		warmupErrMsg.innerText = INPUT_ERR_MSG;
		warmup.style.border = "2px solid red";
		
		// When the input is changed, remove the error message
		warmup.addEventListener("input", () => removeInputErrMsg(warmup, warmupErrMsg));
		valid = false;
	}
	
	return valid;
	
}

function startTimer(ev) {
	// Stop the form from doing its default action
	ev.preventDefault();
	ev.stopPropagation();
	
	
	// If the input fields fails validation, then return
	if(!validateFields()) {
		return;
	}
	
	//Set timer object
	timerStats.duration = Number(duration.value);
	timerStats.warmUp = Number(  warmup.value  ) * ONE_SECOND;
	timerStats.startingBell = startingBell.value;
	timerStats.endingBell = endingBell.value;
	console.log(timerStats);
	
	// Change to meditate mode
	changeModes();
	
	// Calculate the countdown every second
	let startTime = new Date();	
	
	// Create a clone of the start time, adding the starting duration
	let endTime = new Date(startTime.getFullYear(), 
		startTime.getMonth(), startTime.getDate(),
		startTime.getHours(), 
		Number( startTime.getMinutes() ) + timerStats.duration,
	 	startTime.getSeconds() + timerStats.warmUp);
	
	console.log(startTime)
	console.log(endTime)
	
	let offsetToRoundUpToClosestSecond = ONE_SECOND;
	timerStats.timeLeft = offsetToRoundUpToClosestSecond + endTime.getTime() - startTime.getTime();
	
	
	
	calcCountdown();
	countdownInterval = setInterval(calcCountdown, ONE_SECOND);
	
	
	
	// Display the countdown
	//countdown.innerText = timerStats.duration;
}


function calcCountdown() {
	console.log(timerStats.timeLeft)
	if(timerStats.timeLeft < ONE_SECOND) {
		countdown.innerText = `00:00`;
		endInterval();
	} else {
		
		let hours = Math.floor((timerStats.timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
		let minutes = Math.floor((timerStats.timeLeft % (1000 * 60 * 60)) / (1000 * 60));
		let seconds = Math.floor((timerStats.timeLeft % (1000 * 60)) / 1000);
		
		let countdownText = ``;
		
		if(hours > 0) {
			countdownText += `${hours}:`;
		}
		
		// Always display 2 digits in the minutes column
		if(minutes >= 10){
			countdownText += `${minutes}:`;
		} else{
			countdownText += `0${minutes}:`;
		}
		
		// Always display 2 digits in the seconds column
		if(seconds >= 10){
			countdownText += `${seconds}`;
		} else{
			countdownText += `0${seconds}`;
		}
		
		countdown.innerText = countdownText;
		
		//Decrement the amount of time left by 1000ms or 1 second
		timerStats.timeLeft -= ONE_SECOND;
			
	}
	
}

function startInterval() {
	countdownInterval = setInterval(calcCountdown, ONE_SECOND);
}

function endInterval() {
	clearInterval(countdownInterval);
}

function togglePauseScreen() {
	finish.classList.toggle("hidden");
	pause.classList.toggle("hidden");
	play.classList.toggle("hidden");
}

function changeModes() {
	//Change to meditate mode
	title.classList.toggle("hidden");
	form.classList.toggle("hidden");
	container.classList.toggle("meditating");
	countdown.classList.toggle("hidden");
	pause.classList.toggle("hidden");
	setTimeout(() => pause.classList.toggle("fadein"), 50);
}

function displayForm() {
	//Remove pause screen
	togglePauseScreen();
	changeModes();
}
