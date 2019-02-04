let counter = 0;
var w = window.innerWidth;
var h = window.innerHeight;
let ax = [0];
let ay = [0];

var x, y; // position of the turtle
var currentangle = 0; // direction turtle is pointing
var step = 3; // distance for 'F'
var angle = 60; // angle of a turn ('-' or '+')

// LINDENMAYER SYSTEMS
var thestring = 'A'; // axiom
var numloops = 8; // number of iterations
var therules = []; // empty array for rules
therules[0] = ['A', 'BF-AF-B']; // first rule - A becomes B-A-B
therules[1] = ['B', 'AF+BF+A']; // second rule - B becomes A+B+A

var whereinstring = 0; // where in the L-system are we?

function setup() {
	createCanvas(w, h);
	background(255);
	stroke(0, 0, 0, 255);
	x = 0;
	y = 0;

	// LOOP THROUGH L-SYSTEM
	for (var i = 0; i < numloops; i++) {
		thestring = lindenmayer(thestring);
	}
}

function draw() {
	//translate(w/2,h/2);
	// draw current character
	drawIt(thestring[whereinstring]);
	whereinstring++;
	if (whereinstring > thestring.length - 1) whereinstring = 0;
	//increment whereinstring and wrap at the end
}

// interpret an L-system
function lindenmayer(s) {
	var outputstring = ''; // start a blank output string

	// iterate through 'therules' looking for symbol matches:
	for (var i = 0; i < s.length; i++) {
		var ismatch = 0; // by default, no match
		for (var j = 0; j < therules.length; j++) {
			if (s[i] == therules[j][0]) {
				outputstring += therules[j][1]; // write substitution
				ismatch = 1; // we have a match, so don't copy over symbol
				break; // get outta this for() loop
			}
		}
		// if nothing matches, just copy the symbol over.
		if (ismatch == 0) outputstring += s[i];
	}

	return outputstring; // send out the modified string
}


// this is a custom function that draws turtle commands
function drawIt(k) {
	translate(w/2,h/2);
	if (k == 'F') { // draw forward
		// polar to cartesian based on step and currentangle:
		var x1 = x + step * cos(radians(currentangle));
		var y1 = y + step * sin(radians(currentangle));

		x = x1;
		y = y1;
		ax.push(x1);
		ay.push(y1);



		counter += 1; // count number of steps forward
		var logthree = Math.log(counter) / Math.log(3);
		var width = Math.max.apply(Math, ax);
		var height = Math.max.apply(Math, ay);
		var newangle = 0;

		rotate(counter/1000%360);

		background(255, 0, 0);
		scale(10/(Math.log(counter)));
		translate(-width/2,-height/2);
		point(width/2, height/2);
		for (var i = 0; i < counter; i++) {
			colorMode(HSB);
			stroke(0.1111111*i%360,100,100);
			line(ax[i - 1], ay[i - 1], ax[i], ay[i]);
	}
	} else if (k == '+') {
		currentangle += angle; // turn left
	} else if (k == '-') {
		currentangle -= angle; // turn right
	}
}
