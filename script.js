document.addEventListener('DOMContentLoaded', function() {

    // --- Configuration ---
    // Add or remove taglines here. The script will cycle through them.
    const taglines = [
    "Clarifying Data with Security and Design",

    "Security, Data, Interactive Clarity",

    "Clarifying Data with Se¢»rity ▓nd Design",

    "S█¢ur▓ty, Ð»ta wi▓h Intera¢tive ¢larity",

    "Ðe§█gn ƒ▒r Se¢urιty, αnd Ða▒a",

    "C█ar※fying §█cur█ty Dα╚α",

    "S▒cu▓in█ Ðata ▒▓ wιt█ Cla▒ιty",

    "▓▒▒ Ðεsιgn ▒▓▒ S▒c▓rity ║╚",

    "║▌§¿█║▒▓▒ ╝·╚»«╟▓▒ █║"
];

    const typingSpeed = 60;        
    const deletingSpeed = 30;        
    const pauseAfterTyping = 5000;    
    const pauseAfterDeleting = 1000;   



    const taglineEl = document.getElementById('tagline');
    let taglineIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeEffectLoop() {
        const currentTagline = taglines[taglineIndex];
        let speed = typingSpeed;
        
        // Check if we are deleting or typing
        if (isDeleting) {
            speed = deletingSpeed;
            // Remove a character
            taglineEl.innerHTML = currentTagline.substring(0, charIndex - 1) + '<span class="cursor"></span>';
            charIndex--;

            // If done deleting, pause then switch to typing mode
            if (charIndex === 0) {
                isDeleting = false;
                taglineIndex = (taglineIndex + 1) % taglines.length; // Move to the next tagline
                speed = pauseAfterDeleting;
            }

        } else {
            // Add a character
            taglineEl.innerHTML = currentTagline.substring(0, charIndex + 1) + '<span class="cursor"></span>';
            charIndex++;

            // If done typing, pause then switch to deleting mode
            if (charIndex === currentTagline.length) {
                isDeleting = true;
                speed = pauseAfterTyping;
            }
        }
        
        // Call the loop again after the calculated time
        setTimeout(typeEffectLoop, speed);
    }

    // Initial call to start the effect
    typeEffectLoop();
});