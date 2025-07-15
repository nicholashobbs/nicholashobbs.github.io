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

    // TUNING LEVER 1: The speed of the corruption "ticker" in events per second.
    const corruptionRatePerSecond = [ 1, 2, 3, 4, 6, 8, 17, 30, 40 ];

    // TUNING LEVER 2: The chance for any character to change on a single tick.
    // These numbers are small because they are applied to *every* character on every tick.
    const corruptionChancePerTick = [
        0.002, // Level 0: Very low chance
        0.003,  // Level 1
        0.004,  // Level 2
        0.005,  // Level 3
        0.007,  // Level 4
        0.009,  // Level 5
        0.011,   // Level 6
        0.02,   // Level 7
        0.03    // Level 8: Highest base chance
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
    let corruptionTimerId = null;
    
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
    
    /**
     * The new "Corruption Ticker". On each tick, it attempts to corrupt every character.
     */
    function corruptionTicker() {
        const chance = corruptionChancePerTick[currentPacerIndex];
        let changed = false;

        textElementsState.forEach(state => {
            state.charStates.forEach(charState => {
                const attemptProbability = charState.isCorrupted ? chance * reCorruptionPenalty : chance;
                if (charState.current.trim().length > 0 && Math.random() < attemptProbability) {
                    charState.isCorrupted = true;
                    charState.current = glitchChars[Math.floor(Math.random() * glitchChars.length)];
                    charState.color = glitchColorPalette[Math.floor(Math.random() * glitchColorPalette.length)];
                    changed = true;
                }
            });
        });

        if (changed) {
            needsRender = true;
        }

        const rate = corruptionRatePerSecond[currentPacerIndex];
        const delay = 1000 / rate;
        corruptionTimerId = setTimeout(corruptionTicker, delay);
    }

    function startNewCorruptionCycle() {
        if (corruptionTimerId) clearTimeout(corruptionTimerId);

        textElementsState = [];
        pristineState.forEach(item => {
            const charStates = item.originalText.split('').map(char => ({
                current: char,
                isCorrupted: false,
                color: null
            }));
            textElementsState.push({ element: item.element, charStates: charStates });
        });
        
        needsRender = true;
        corruptionTicker();
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