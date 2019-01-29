let a = 0;
let counter = 0;
var w = window.innerWidth;
var h = window.innerHeight;
let height = 0;
let width = 0;
let ax = [0];
let ay = [0];
var x, y; // the current position of the turtle
var currentangle = 0; // which way the turtle is pointing
var step = 3; // how much the turtle moves with each 'F'
var angle = 60; // how much the turtle turns with a '-' or '+'

// LINDENMAYER STUFF (L-SYSTEMS)
var thestring = 'A'; // "axiom" or start of the string
var numloops = 8; // how many iterations to pre-compute
var therules = []; // array for rules
therules[0] = ['A', 'BF-AF-B']; // first rule
therules[1] = ['B', 'AF+BF+A']; // second rule

var whereinstring = 0; // where in the L-system are we?

function setup() {
	createCanvas(w, h);
	background(255);
	stroke(0, 0, 0, 255);
	// start the x and y position at lower-left corner
	x = 0;
	y = 0;

	// COMPUTE THE L-SYSTEM
	for (var i = 0; i < numloops; i++) {
		thestring = lindenmayer(thestring);
	}
}

function draw() {
	translate(w/2,h/2);
	// draw the current character in the string:

	drawIt(thestring[whereinstring]);
	// increment the point for where we're reading the string.
	// wrap around at the end.
	whereinstring++;
	if (whereinstring > thestring.length - 1) whereinstring = 0;

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
		var width = Math.pow(2, (logthree));
		var height = width*(Math.sqrt(3)/2);


		rotate(counter/500);
		translate(-1*height,-1*width);
		scaling = (80 / width);

		background(255, 0, 100);
		scale(scaling);
		for (var i = 0; i < counter; i++) {
			colorMode(HSB);
   		stroke(i*(255/243)/9%255,100,100);
			line(ax[i - 1], ay[i - 1], ax[i], ay[i]);

	}



	} else if (k == '+') {
		currentangle += angle; // turn left
	} else if (k == '-') {
		currentangle -= angle; // turn right
	}



}
