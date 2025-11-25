const lines = {
	'<30': ['Better warm up first', 'Awkward', 'Taking a nap', 'Fell asleep', 'Snail much'],
	'<60': [
		'Slow and steady',
		'Atleast you can type',
		'Skill issue',
		'Turtle much',
		'Practice never hurts'
	],
	'<100': [
		'Keep going',
		'Solid work',
		'Not bad at all',
		'Steady hands',
		'Fast and furious',
		'Almost there',
		'Impressive',
		'Way to go, champ',
		'That is some speed'
	],
	'<150': ['Legendary', 'Typing diety', 'Keycap sorcerer', 'Lightning fingers'],
	'>i': ['Faster than a blink', 'Godspeed', 'Truly ascended']
};

export const getLine = (n: number): string => {
	let arr: string[];
	if (n < 30) {
		arr = lines['<30'];
	} else if (n < 60) {
		arr = lines['<60'];
	} else if (n < 100) {
		arr = lines['<100'];
	} else if (n < 150) {
		arr = lines['<150'];
	} else {
		arr = lines['>i'];
	}

	return arr[Math.floor(Math.random() * arr.length)];
};
