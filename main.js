
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

function checkStreak() {
	const MILLISECONS_IN_A_DAY = 86400000;
	
	let firstMeditationOfTheDay;
	
	// If there is a streak then add one to it
	let streak = Number( localStorage.getItem("streak") );
	let lastMeditationValue = Number ( localStorage.getItem("lastMeditationValue"));
	let lastMeditationDay = Number( localStorage.getItem("lastMeditationDay"));
	// If there is no streak or it's not a consecutive day'
	
	
	if ( Number(lastMeditationDay) + 1 == timerStats.endTime.getDay() &&
		timerStats.endTime.valueOf() - lastMeditationValue < MILLISECONS_IN_A_DAY ) {
		// it is a consecutive day
		streak += 1;
		firstMeditationOfTheDay = true;
	} else if( timerStats.endTime.valueOf() - lastMeditationValue < MILLISECONS_IN_A_DAY ) {
		// If its in the same day don't mod the streak
		firstMeditationOfTheDay = false;
	} else {
		streak = 1;
		firstMeditationOfTheDay = true;
	}
	return {streak: streak, firstMeditationOfTheDay: firstMeditationOfTheDay};
}

function dispalyRecapScreen() {
	recapScreen.classList.remove("hidden");
	
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
	
	
	/*
	const NUMBER_OF_DAYS = 7;
	for(let i = 0; i < NUMBER_OF_DAYS; i++) {
		
	}
	*/
	
	let streakObj = checkStreak();
	
	
	
	// Update local storage
	localStorage.setItem("lastMeditationValue", `${timerStats.endTime.valueOf()}`);
	localStorage.setItem("lastMeditationDay", `${timerStats.endTime.getDay()}`);
	localStorage.setItem("streak", `${streakObj.streak}`);
	console.log(localStorage);
	
	// Dislay the streak values
	daysCounter.innerText = `${streakObj.streak}`;
	let day = timerStats.endTime.getDay();
	const currentDay = day;
	// Fill in the day icon bubbles
	while(streakObj.streak > 0 && day >= 0) {
		// If it's the current day then fade in that bubble
		if(streakObj.firstMeditationOfTheDay && currentDay == day) {
			daysIcons[day].classList.add("currentDay");
			setTimeout(() => daysIcons[Day].classList.add("completed"), 300);
		} else{
			daysIcons[day].classList.add("completed");
		}

		streakObj.streak--;
		day--;
	}
	
	
	
	
	// If there is no streak or the streak is 0
	
	
	
	
	if(timerStats.timeMeditated < ONE_MINUTE) {
		timeMeditated.innerText = (timerStats.timeMeditated / ONE_SECOND) - 1;
		timeLabel.innerText = " seconds ";
	} else {
		timeMeditated.innerText = Math.floor(timerStats.timeMeditated / ONE_MINUTE);
		timeLabel.innerText = " minutes ";
	}
	
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




