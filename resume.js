// resume.js
document.addEventListener('DOMContentLoaded', function() {
    // The same color palette from your landing page theme
    const seoul256Palette = [
        '#d68787', // Red
        '#d7af87', // Yellow
        '#afd787', // Light Green
        '#87d7af', // Green
        '#87afd7', // Blue
        '#af87d7'  // Purple
    ];

    // Find all the <strong> elements within the resume list items
    const keywords = document.querySelectorAll('.resume-item strong');

    // Loop through each keyword element
    keywords.forEach(keyword => {
        // Pick a random color from the palette
        const randomColor = seoul256Palette[Math.floor(Math.random() * seoul256Palette.length)];
        
        // Apply the random color directly to the element
        keyword.style.color = randomColor;
    });
});