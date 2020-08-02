var med = require("./med");

test("5 mins apart but on diff days are a two day streak", () => {
	let day1 = new Date("1995-12-17T23:56:00");
	let day2 = new Date("1995-12-18T00:04:00");
	let streak = 1;
	// lastMeditationValue
	lmv = day1.valueOf();
	lmd = day1.getDay();
	endTimeValue = day2.valueOf();
	endTimeDay = day2.getDay();
	
	expect(med(streak, lmv, lmd, endTimeValue, endTimeDay)).toBe(2)
});

test("5 hours apart diff day 6 day streak", () => {
	let day1 = new Date("1995-12-17T23:56:00");
	let day2 = new Date("1995-12-18T04:04:00");
	let streak = 5;
	// lastMeditationValue
	lmv = day1.valueOf();
	lmd = day1.getDay();
	endTimeValue = day2.valueOf();
	endTimeDay = day2.getDay();
	
	expect(med(streak, lmv, lmd, endTimeValue, endTimeDay)).toBe(6)
})

test("5 hours apart same day 5 day streak", () => {
	let day1 = new Date("1995-12-18T10:56:00");
	let day2 = new Date("1995-12-18T04:04:00");
	let streak = 5;
	// lastMeditationValue
	lmv = day1.valueOf();
	lmd = day1.getDay();
	endTimeValue = day2.valueOf();
	endTimeDay = day2.getDay();
	
	expect(med(streak, lmv, lmd, endTimeValue, endTimeDay)).toBe(5)
})


test("3 days apart", () => {
	let day1 = new Date("1995-12-17T23:56:00");
	let day2 = new Date("1995-12-20T04:04:00");
	let streak = 0;
	// lastMeditationValue
	lmv = day1.valueOf();
	lmd = day1.getDay();
	endTimeValue = day2.valueOf();
	endTimeDay = day2.getDay();
	
	expect(med(streak, lmv, lmd, endTimeValue, endTimeDay)).toBe(1)
})