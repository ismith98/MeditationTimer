var moment = require('moment');
moment().format();

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

var timerStats = {};
var warmupInterval;
var countdownInterval;

// 1 second = 1000ms
const ONE_SECOND = 1000;
const ONE_MINUTE = 60 * 1000;
const INPUT_ERR_MSG = "Must be a whole number greater than 0";

submit.addEventListener("click", startTimer);

pause.addEventListener("click", ()=> {endInterval();  togglePauseScreen() });
play.addEventListener("click", ()=> {startInterval();  togglePauseScreen() } );

discard.addEventListener("click", ()=> {finishMeditating(); displayHomeScreen() });
finish.addEventListener("click", completeSession);

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
	
	// If the warmup field is empty then change it's value to 0
	// 0 can be accepted in the warmup field
	if(warmup.value == "") {
		warmup.value = 0;
	}
	
	// Test the warmup field this can be 0
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

function startTimer(ev) {
	// Stop the form from doing its default action
	ev.preventDefault();
	ev.stopPropagation();
	
	
	// If the input fields fails validation, then return
	if(!validateFields()) {
		return;
	}
	
	//Set timer object
	timerStats.totalTime = Number(duration.value) * ONE_MINUTE;
	timerStats.timeLeft = Number(duration.value) * ONE_MINUTE;
	timerStats.warmup = Number(  warmup.value  ) * ONE_SECOND;
	timerStats.startingBell = startingBell.value;
	timerStats.endingBell = endingBell.value;
	
	displayWarmupScreen();
	/*
	displayMeditationScreen();
	dispalyRecapScreen();
	displayHomeScreen();
	*/
	// Warm up countdown
	warmupCountdown();
	if(timerStats.warmup != 0) {
		warmupInterval = setInterval(warmupCountdown, ONE_SECOND);
	}
	
	
	// Countdown every second
	/*meditationCountdown();
	countdownInterval = setInterval(meditationCountdown, ONE_SECOND);
	*/	
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

function completeSession() {
	timerStats.endTime = new Date();
	// Find out the session length in ms
	timerStats.timeMeditated = timerStats.totalTime - timerStats.timeLeft;
	console.log(timerStats);
	
	finishMeditating();
	dispalyRecapScreen();
}


function meditationCountdown() {
	//console.log(timerStats.timeLeft)
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

function startInterval() {
	countdownInterval = setInterval(meditationCountdown, ONE_SECOND);
}

function endInterval() {
	clearInterval(countdownInterval);
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


// Before I imported moment.js
function checkStreak() {
	const MILLISECONS_IN_A_DAY = 86400000;
	
	let firstMeditationOfTheDay;
	
	// If there is a streak then add one to it
	let streak = Number( localStorage.getItem("streak") );
	let lastMeditationValue = Number ( localStorage.getItem("lastMeditationValue"));
	//let lastMeditationDay = Number( localStorage.getItem("lastMeditationDay"));
	// If there is no streak or it's not a consecutive day'
	
	let daysMeditatedEachWeek = updateWeek(lastMeditationValue);
	
	let startOfDay = moment().startOf('day');
	let lastMeditationDate = moment(lastMeditationValue);
	
	if(lastMeditationDate.isSame(timerStats.endTime, "day")){
		// If its in the same day don't mod the streak
	} else if( lastMeditationDate.add(1, "day").isSame(timerStats.endTime, "day") ) {
		// If its a consecutive day add increment the streak
		streak++;
	} else {
		// If it's neither, start a new streak
		streak = 1;
	}
	/*
	if ( Number(lastMeditationDay) + 1 == timerStats.endTime.getDay() &&
		timerStats.endTime.valueOf() - lastMeditationValue < MILLISECONS_IN_A_DAY ) {
		// it is a consecutive day
		streak += 1;
	} else if( timerStats.endTime.valueOf() - lastMeditationValue < MILLISECONS_IN_A_DAY ) {
		// If its in the same day don't mod the streak
	} else {
		streak = 1;
	}*/
	return {streak: streak, daysMeditatedEachWeek: daysMeditatedEachWeek};
}

function updateWeek(lastMeditationValue) {
	let lastMeditationDate = moment(lastMeditationValue);
	// Use the local storage values to figure out which days you meditated this week
	let startOfWeek = moment().startOf('week');
	
	let daysMeditatedEachWeek = localStorage.getItem("daysMeditatedEachWeek")
	// if its a new week or there is no week data, then create it
	if(lastMeditationDate.diff(startOfWeek) < 0 || daysMeditatedEachWeek == "" 
		|| daysMeditatedEachWeek == null) {
			daysMeditatedEachWeek = new Array(7);
			// Use strings bc it will be converted to strings when stored localStorage
			daysMeditatedEachWeek.fill("false");
		}
	// Else, there is already week data so get it from local memory
	
		else {
			// Convert the string into an array
			daysMeditatedEachWeek = daysMeditatedEachWeek.split(",");
		}
	
	
	// Completed a meditation that day
	daysMeditatedEachWeek[timerStats.endTime.getDay()] = "true";
	
	//Update local storage
	localStorage.setItem("daysMeditatedEachWeek", daysMeditatedEachWeek/*.toString()*/);
	
	return daysMeditatedEachWeek;
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
		if(i == day && streakObj.daysMeditatedEachWeek[i] == "true" ) {
				// Play a fade in animation on that days bubble
				daysIcons[i].classList.add("currentDay");
				setTimeout(() => daysIcons[i].classList.add("completed"), 300);
		} 
		// If you completed a meditation on a previous day
		else if (streakObj.daysMeditatedEachWeek[i] == "true" ) {
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

function displayHomeScreen() {
	//Display the title and form
	title.classList.remove("hidden");
	form.classList.remove("hidden");
}




