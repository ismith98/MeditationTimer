var moment = require('moment');
moment().format();


//Set up a couple of global variables
var timerStats = {};
var warmupInterval;
var countdownInterval;
// 1 second = 1000ms
const ONE_SECOND = 1000;
const ONE_MINUTE = 60 * 1000;
const INPUT_ERR_MSG = "Must be a whole number greater than 0";


function startTimer(ev) {
	// Stop the form from doing its default action
	ev.preventDefault();
	ev.stopPropagation();
	
	if(!validateFields()) {
		return;
	}
	
	setTimerStats();	
	
	displayWarmupScreen();
	// Start the countdown on the warmup screen
	warmupCountdown();
	if(timerStats.warmup > 0) {
		warmupInterval = setInterval(warmupCountdown, ONE_SECOND);
	}
	
}

function validateFields() {
	// Only accept whole numbers
	let pattern = new RegExp("^\\d+$");
	let valid = true;
	
	
	if(!pattern.test(duration.value) || duration.value == 0 ) {
		// Show the error message and make the border red
		durationErrMsg.innerText = INPUT_ERR_MSG;
		duration.style.border = "2px solid red";
		
		// When the input is changed, remove the error message
		duration.addEventListener("input", () => removeInputErrMsg(duration, durationErrMsg));
		valid = false;
	}
	
	// If the warmup field is empty then change it's value to 0
	// 0 can be accepted in the warmup field
	if(warmup.value == "") {
		warmup.value = 0;
	}
	
	if(!pattern.test(warmup.value) ) {
		// Show the error message and make the border red
		warmupErrMsg.innerText = INPUT_ERR_MSG;
		warmup.style.border = "2px solid red";
		
		// When the input is changed, remove the error message
		warmup.addEventListener("input", () => removeInputErrMsg(warmup, warmupErrMsg));
		valid = false;
	}
	
	return valid;
	
}

function removeInputErrMsg(inputElement, errMsgElement){

	errMsgElement.innerText = "";
	inputElement.style.border = "2px solid #ccc";
	inputElement.removeEventListener("input", () => removeInputErrMsg(inputElement, errMsgElement));
}

function setTimerStats() {
	timerStats.totalTime = Number(duration.value) * ONE_MINUTE;
	timerStats.timeLeft = Number(duration.value) * ONE_MINUTE;
	timerStats.warmup = Number(  warmup.value  ) * ONE_SECOND;
	timerStats.startingBell = startingBell.value;
	timerStats.endingBell = endingBell.value;
}


function warmupCountdown() {
	if(timerStats.warmup < ONE_SECOND) {
		clearInterval(warmupInterval);
		countdown.innerText = `00:00`;
		
		displayMeditationScreen();
		
		// Start the meditation countdown
		meditationCountdown();
		countdownInterval = setInterval(meditationCountdown, ONE_SECOND);
		// Play the start gong
		return;
	} else {
		let seconds = Math.floor((timerStats.warmup ) / 1000);
		countdown.innerText = `${seconds}`;
		
		//Decrement the amount of time left by 1000ms or 1 second
		timerStats.warmup -= ONE_SECOND;
	}
}


function meditationCountdown() {
	if(timerStats.timeLeft < ONE_SECOND) {
		completeSession();
		countdown.innerText = `00:00`;
		clearInterval(countdownInterval);
	} else {
		
		let hours = Math.floor((timerStats.timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
		let minutes = Math.floor((timerStats.timeLeft % (1000 * 60 * 60)) / (1000 * 60));
		let seconds = Math.floor((timerStats.timeLeft % (1000 * 60)) / 1000);
		
		let countdownText = ``;
		
		// If its over an hour long then display an hours column
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


function completeSession() {
	timerStats.endTime = new Date();
	// Find out the session length in ms
	timerStats.timeMeditated = timerStats.totalTime - timerStats.timeLeft;
	console.log(timerStats);
	
	finishMeditating();
	dispalyRecapScreen();
}


function displayWarmupScreen() {
	title.classList.add("hidden");
	form.classList.add("hidden");
	container.classList.add("meditating");
	
	// Display the countdown text
	countdown.classList.remove("hidden");
	// Hide the warmup message
	warmupText.classList.remove("hidden");
}

function displayMeditationScreen() {
	// Hide the warmup message
	warmupText.classList.add("hidden");
	
	// Display the pause button
	pause.classList.remove("hidden");
	setTimeout(() => pause.classList.toggle("fadein"), 50);
}

function togglePauseScreen() {
	discard.classList.toggle("hidden");
	finish.classList.toggle("hidden");
	pause.classList.toggle("hidden");
	play.classList.toggle("hidden");
}

function finishMeditating() {
	countdown.classList.add("hidden");
	discard.classList.add("hidden");
	finish.classList.add("hidden");
	play.classList.add("hidden");
	pause.classList.add("hidden");
	pause.classList.toggle("fadein");
	
	// Return the container's shape to a square
	container.classList.remove("meditating");
}




function dispalyRecapScreen() {
	recapScreen.classList.remove("hidden");
	//localStorage.clear();

	let timeMeditated = document.querySelector("#timeMeditated");
	let timeLabel = document.querySelector("#timeLabel");
	let daysCounter = document.querySelector("#daysCounter");
	let daysIcons = [];
	daysIcons.push(document.querySelector("#sunday"));
	daysIcons.push(document.querySelector("#monday"));
	daysIcons.push(document.querySelector("#tuesday"));
	daysIcons.push(document.querySelector("#wednesday"));
	daysIcons.push(document.querySelector("#thursday"));
	daysIcons.push(document.querySelector("#friday"));
	daysIcons.push(document.querySelector("#saturday"));
	
	// Check if there is a streak and if it is the first time meditating that day
	let streakObj = checkStreak();
	
	// Update local storage
	localStorage.setItem("lastMeditationValue", `${timerStats.endTime.valueOf()}`);
	localStorage.setItem("lastMeditationDay", `${timerStats.endTime.getDay()}`);
	localStorage.setItem("streak", `${streakObj.streak}`);
	localStorage.setItem("daysMeditatedThisWeek", streakObj.daysMeditatedThisWeek);
	// Append this session to local storage
	let sessions = localStorage.getItem("sessions");
	
	if(sessions == "" || sessions == null) {
		// Format: '|' between sessions, '~' between items
		localStorage.setItem("sessions", `${timerStats.endTime.toISOString()}~${timerStats.timeMeditated}`);
	} else {
		// Format: '|' between sessions, '~' between items
		localStorage.setItem("sessions", `${sessions}|${timerStats.endTime.toISOString()}~${timerStats.timeMeditated}`);
	}
	let sessionData = localStorage.getItem("sessions").split("|");
	console.log(localStorage);
	console.log(sessionData);
	console.log(streakObj)
	
	
	// Display how long of a streak you're on
	daysCounter.innerText = `${streakObj.streak}`;
	
	// Fill in the days icon for each day you meditated that week
	let day = timerStats.endTime.getDay();
	for(let i = 0; i <= day; i++) {
		// If its the current day and you completed a meditation
		if(i == day && streakObj.daysMeditatedThisWeek[i] == "true" ) {
				// Play a fade in animation on that days bubble
				daysIcons[i].classList.add("currentDay");
				setTimeout(() => daysIcons[i].classList.add("completed"), 300);
		} 
		// If you completed a meditation on a previous day
		else if (streakObj.daysMeditatedThisWeek[i] == "true" ) {
				daysIcons[i].classList.add("completed");
		}
	}
	
	// Display how long this past session was
	// If the meditation was less than a minute, say the amount of seconds
	// Otherwise state the amount of minutes
	if(timerStats.timeMeditated < ONE_MINUTE) {
		timeMeditated.innerText = (timerStats.timeMeditated / ONE_SECOND) - 1;
		timeLabel.innerText = " seconds ";
	} else {
		timeMeditated.innerText = Math.floor(timerStats.timeMeditated / ONE_MINUTE);
		timeLabel.innerText = " minutes ";
	}
	
	// Functionality for the close button: return to homescreen
	let closeButton = document.querySelector("#closeButton");
	closeButton.addEventListener("click", () => {
		recapScreen.classList.add("hidden");
		displayHomeScreen();
	})
	
}

function checkStreak() {

	let streak = Number( localStorage.getItem("streak") );
	let lastMeditationValue = Number ( localStorage.getItem("lastMeditationValue"));
	let lastMeditationDate = moment(lastMeditationValue);
	let daysMeditatedThisWeek = getDaysMeditatedThisWeek(lastMeditationValue);
	
	if(lastMeditationDate.isSame(timerStats.endTime, "day")){
		// Don't mod the streak if previously meditated that day
	} else if( lastMeditationDate.add(1, "day").isSame(timerStats.endTime, "day") ) {
		// If its a consecutive day add increment the streak
		streak++;
	} else {
		// If it's neither, start a new streak
		streak = 1;
	}

	return {streak: streak, daysMeditatedThisWeek: daysMeditatedThisWeek};
}

function getDaysMeditatedThisWeek(lastMeditationValue) {
	let lastMeditationDate = moment(lastMeditationValue);
	let startOfWeek = moment().startOf('week');
	let daysMeditatedThisWeek = localStorage.getItem("daysMeditatedThisWeek");
	
	// Use the local storage values to figure out which days you meditated this week
	
	// if it's a new week or there is nothing in local storage then create a new array
	if(lastMeditationDate.diff(startOfWeek) < 0 || daysMeditatedThisWeek == "" 
		|| daysMeditatedThisWeek == null) {
			
			daysMeditatedThisWeek = new Array(7);
			daysMeditatedThisWeek.fill("false");
			// Use strings bc it will be converted to strings when stored in localStorage
		}	else {
			// There is already week data for this week so get it from local memory
			daysMeditatedThisWeek = daysMeditatedThisWeek.split(",");
		}
	
	// Mark that a meditation was completed that day
	daysMeditatedThisWeek[timerStats.endTime.getDay()] = "true";
	
	return daysMeditatedThisWeek;
}

function displayHomeScreen() {
	//Display the title and form
	title.classList.remove("hidden");
	form.classList.remove("hidden");
}


// Query selectors for every html element needed to start meditating
var submit = document.querySelector("#submit");
var duration = document.querySelector("#duration");
var durationErrMsg = document.querySelector("#durationErrMsg");
var warmup = document.querySelector("#warmup");
var warmupErrMsg = document.querySelector("#warmupErrMsg");
var startingBell = document.querySelector("#startingBell");
var endingBell = document.querySelector("#endingBell");
var form = document.querySelector("form");
var container = document.querySelector(".container");
var title = document.querySelector("#title");
var countdown = document.querySelector("#countdown");
var pause = document.querySelector(".button.pause");
var play = document.querySelector(".button.play");
var warmupText = document.querySelector("#warmupText");

var discard = document.querySelector("#discard");
var finish = document.querySelector("#finish");

var recapScreen = document.querySelector("#recapScreen");



// Start the timer when the form is submitted
submit.addEventListener("click", startTimer);

// Start and stop the timer with the pause and play buttons
pause.addEventListener("click", ()=> {clearInterval(countdownInterval);  togglePauseScreen() });
play.addEventListener("click", ()=> { 
	countdownInterval = setInterval(meditationCountdown, ONE_SECOND);
	togglePauseScreen();
});

// Stop the timer with the discard and finish buttons
discard.addEventListener("click", ()=> {finishMeditating(); displayHomeScreen() });
finish.addEventListener("click", completeSession);



