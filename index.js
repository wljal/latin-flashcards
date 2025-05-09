let latinWords = [];
let englishDefinitions = [];

let selectedWord = 0;
let flipped = false;

function updateCsvs() {
    const minChapter = parseInt(document.getElementById("initial-chapter").value);
    const maxChapter = parseInt(document.getElementById("max-chapter").value);

    latinWords = [];
    englishDefinitions = [];

    for (let i = minChapter; i <= maxChapter; i++) {
        const filePath = `https://wljal.github.io/latin-flashcards/csvs/${i}.csv`; // Path to the CSV file

        fetch(filePath)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch ${filePath}: ${response.statusText}`);
                }
                return response.text();
            })
            .then(fileContent => {
                const lines = fileContent.split('\n');
                lines.shift(); // Remove the header row
                lines.forEach(element => {
                    if(lines != "") {
                    const both = element.split(/,(.*)/s);
                    latinWords.push(both[0]);
                    englishDefinitions.push(both[1]);
                    }
                });
                updateFlashcard();
            })
            .catch(error => {
                console.error(error);
            });
    }
}

$(document).on('click', '#next', function () { selectedWord++; if (selectedWord > latinWords.length) selectedWord = latinWords.length; flipped = $("#switch").is(":checked") ; updateFlashcard(); });
$(document).on('click', '#prev', function () { selectedWord--; if (selectedWord < 0) selectedWord = 0; flipped = $("#switch").is(":checked"); updateFlashcard(); });
$(document).on('click', '.flashcard', function () { flipped = !flipped; updateFlashcard(); });
$(document).on('click', '.shuffle', function () { shuffleArray(latinWords); flipped = $("#switch").is(":checked"); updateFlashcard(); });
$(document).on('click', '.delete', function () { latinWords.splice(selectedWord, 1); englishDefinitions.splice(selectedWord, 1); flipped = $("#switch").is(":checked"); updateFlashcard(); });

$(document).on('click', '#load-chapters', function () { updateCsvs(); });


function updateFlashcard() {
    if (latinWords.length > 0) {
        if (!flipped)
            $(".word").text(latinWords[selectedWord]);
        else
            $(".word").text(englishDefinitions[selectedWord]);
    } else {
        $(".word").text("No words loaded");
    }
}

function shuffleArray() {
    // Combine latinWords and englishDefinitions into a single array of pairs
    const pairedArray = latinWords.map((word, index) => ({
        latin: word,
        english: englishDefinitions[index],
    }));

    // Shuffle the paired array
    for (let i = pairedArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1)); // Random index from 0 to i
        [pairedArray[i], pairedArray[j]] = [pairedArray[j], pairedArray[i]]; // Swap elements
    }

    // Split the paired array back into separate arrays
    latinWords = pairedArray.map(pair => pair.latin);
    englishDefinitions = pairedArray.map(pair => pair.english);
}

let circleX = 0; // Current X position of the circle
let circleY = 0; // Current Y position of the circle
let targetX = 0; // Target X position (cursor)
let targetY = 0; // Target Y position (cursor)
const easing = 0.07; // Adjust this value for more or less delay (0.1 = slow, 0.3 = fast)

// Update target position on mousemove
document.addEventListener('mousemove', (event) => {
    targetX = event.clientX; // Cursor's X position
    targetY = event.clientY; // Cursor's Y position
});

// Animation loop
function animateCircle() {
    const glowCircle = document.querySelector('.glow-circle');

    if (!glowCircle) {
        console.error("Glow circle element not found!");
        return;
    }

    // Gradually move the circle toward the target position
    circleX += (targetX - circleX) * easing;
    circleY += (targetY - circleY) * easing;

    // Update the circle's position
    glowCircle.style.left = `${circleX}px`;
    glowCircle.style.top = `${circleY}px`;

    // Continue the animation
    requestAnimationFrame(animateCircle);
}

// Start the animation loop
requestAnimationFrame(animateCircle);
