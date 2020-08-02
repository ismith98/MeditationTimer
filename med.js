function checkStreak(streak, lmv, lmd, endTimeValue, endTimeDay) {
	
	const MILLISECONS_IN_A_DAY = 86400000;
	
	let firstMeditationOfTheDay;
	
	// If there is a streak then add one to it
	//let streak = Number( localStorage.getItem("streak") );
	//let lastMeditationValue = Number ( localStorage.getItem("lastMeditationValue"));
	//let lastMeditationDay = Number( localStorage.getItem("lastMeditationDay"));
	// If there is no streak or it's not a consecutive day'
	
	// If the day is 1+ the prev one and the value is less than millis in one day then it's consec
	// If streak is null or its not a consec day
	/*if( streak == 0 ) {
		streak = 1;
	} else*/ 
	
	// If it's a consec day
	if( Number(lmd) + 1 == endTimeDay &&
		endTimeValue - lmv < MILLISECONS_IN_A_DAY ) {
			// it is a consecutive day
		streak += 1;
		firstMeditationOfTheDay = true;
		} else if(endTimeValue - lmv < MILLISECONS_IN_A_DAY) {
			// If its in the same day don't mod the streak
			firstMeditationOfTheDay = false;
		} else {
			streak = 1;
			firstMeditationOfTheDay = true;
		}
	
	/*
	if (!( Number(lmd) + 1 == endTimeDay &&
		endTimeValue - lmv < MILLISECONS_IN_A_DAY )) {
		// If its in the same day don't mod the streak
		if(endTimeValue - lmv < MILLISECONS_IN_A_DAY) {
			firstMeditationOfTheDay = false;
		} else {
			streak = 1;
			firstMeditationOfTheDay = true
		}
		// Keep the streak the same
		//streak = 1;
		
	} else {
		// it is a consecutive day
		streak += 1;
		firstMeditationOfTheDay = true;
	}
	*/
	return streak;
}

module.exports = checkStreak;