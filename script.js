document.addEventListener('DOMContentLoaded', function() {
    // --- 1. CONFIGURATION ---

    const pacerTaglines = [
        "Data, Security, Generative Art",
        "Data Clarity with Security & Design",
        "Data Se¢»rity ▓ Design",
        "S█¢ur▓ty, Ð»ta ▓ Gener¢tive ¢rt",
        "Ð█t ƒ▒r Se¢urιty, αnd Ða▒a",
        "C█ar※fying §█cur█ty Dα╚α",
        "S▒cu▓in█ Ðata ▒▓ wιt█ Cla▒ιty",
        "▓▒▒ Ðεsιgn ▒▓▒ S▒c▓rity ║╚",
        "║▌§¿█║▒▓▒ ╝·╚»«╟▓▒ █║"
    ];
    
    const typingSpeed = 80;
    const deletingSpeed = 40;
    const pauseAfterTyping = 3000;
    const pauseAfterDeleting = 500;

    // ADJUSTMENT 1: Slower and more deliberate corruption speed.
    // The time (in ms) for each character's individual timer is now longer.
    const corruptionIntervalRanges = [
        [20000, 40000], // Level 0: A character might change every 20-40 seconds. Very slow.
        [15000, 30000], // Level 1
        [10000, 20000], // Level 2
        [5000, 10000],  // Level 3
        [2000, 6000],   // Level 4
        [1000, 4000],   // Level 5
        [500, 2000],    // Level 6
        [300, 1000],    // Level 7
        [200, 500]      // Level 8: Final stage is active but not frantic.
    ];

    // ADJUSTMENT 2: A smoother, more controlled probability ramp.
    // This gives us fine-grained control over the chance of corruption at each level.
    const corruptionProbabilities = [
        0.10,   // Level 0: 10% chance per tick
        0.15,   // Level 1
        0.25,   // Level 2
        0.35,   // Level 3
        0.50,   // Level 4
        0.65,   // Level 5
        0.80,   // Level 6
        0.95,   // Level 7
        1.00    // Level 8: 100% chance to corrupt any remaining clean characters.
    ];
    
    // A corrupted character is much less likely to change again.
    const reCorruptionPenalty = 0.1; // 10% of the normal chance

    const glitchChars = ['¢', '§', '»', '«', '¿', 'ƒ', 'ι', 'α', 'ε', 'Ð', '§', '※', '▒', '▓', '█', '║', '▌', '╚', '╝', '╟', '╩'];
    const glitchColorPalette = ['#d68787', '#d7af87', '#afd787', '#87d7af', '#87afd7', '#af87d7'];

    // --- 2. STATE MANAGEMENT ---
    const taglineEl = document.getElementById('tagline');
    let pristineState = [];
    let textElementsState = [];
    let currentPacerIndex = 0;
    let needsRender = false;
    
    // --- 3. CORE ARCHITECTURE ---

    function discoverAndStorePristineState() {
        document.querySelectorAll('.glitch-text').forEach(el => {
            pristineState.push({ element: el, originalText: el.textContent });
        });
    }

    function renderLoop() {
        if (needsRender) {
            textElementsState.forEach(state => {
                let html = '';
                state.charStates.forEach(charState => {
                    if (charState.isCorrupted) {
                        html += `<span style="color: ${charState.color};">${charState.current}</span>`;
                    } else {
                        html += charState.current;
                    }
                });
                state.element.innerHTML = html;
            });
            needsRender = false;
        }
        requestAnimationFrame(renderLoop);
    }
    
    function startCharacterLoop(charState) {
        const [min, max] = corruptionIntervalRanges[currentPacerIndex];
        const delay = Math.random() * (max - min) + min;

        charState.timerId = setTimeout(() => {
            const probability = corruptionProbabilities[currentPacerIndex];
            const attemptProbability = charState.isCorrupted ? probability * reCorruptionPenalty : probability;
            
            if (charState.current.trim().length > 0 && Math.random() < attemptProbability) {
                charState.isCorrupted = true;
                charState.current = glitchChars[Math.floor(Math.random() * glitchChars.length)];
                charState.color = glitchColorPalette[Math.floor(Math.random() * glitchColorPalette.length)];
                needsRender = true;
            }
            startCharacterLoop(charState);
        }, delay);
    }
    
    function stopAllCharacterLoops() {
        textElementsState.forEach(state => {
            state.charStates.forEach(charState => {
                if (charState.timerId) clearTimeout(charState.timerId);
            });
        });
    }

    function startNewCorruptionCycle() {
        stopAllCharacterLoops();
        textElementsState = [];
        pristineState.forEach(item => {
            const charStates = item.originalText.split('').map(char => ({
                current: char,
                isCorrupted: false,
                color: null,
                timerId: null
            }));
            textElementsState.push({ element: item.element, charStates: charStates });
        });
        needsRender = true;
        textElementsState.forEach(state => {
            state.charStates.forEach(charState => startCharacterLoop(charState));
        });
    }

    function typeEffectLoop() {
        let isDeleting = false;
        let charIndex = 0;

        function loop() {
            if (currentPacerIndex === 0 && charIndex === 0 && !isDeleting) {
                startNewCorruptionCycle();
            }

            const currentPacer = pacerTaglines[currentPacerIndex];
            let speed = typingSpeed;

            if (isDeleting) {
                speed = deletingSpeed;
                charIndex--;
            } else {
                charIndex++;
            }
            
            const displayedText = currentPacer.substring(0, charIndex);
            taglineEl.innerHTML = `${displayedText}<span class="cursor"></span>`;

            if (!isDeleting && charIndex === currentPacer.length) {
                isDeleting = true;
                speed = pauseAfterTyping;
            } 
            else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                currentPacerIndex = (currentPacerIndex + 1) % pacerTaglines.length;
                speed = pauseAfterDeleting;
            }

            setTimeout(loop, speed);
        }
        loop();
    }

    // --- 4. INITIALIZATION ---
    discoverAndStorePristineState();
    typeEffectLoop();
    renderLoop();
});