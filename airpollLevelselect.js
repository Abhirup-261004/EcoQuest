const smogCanvas = document.getElementById('smogCanvas');
const ctx = smogCanvas.getContext('2d');
smogCanvas.width = window.innerWidth;
smogCanvas.height = window.innerHeight;

let particles = [];
const particleCount = 100; // Increased count for denser smoke

// A class to represent the smoke/smog particles
class SmogParticle {
    constructor() {
        this.reset();
        this.y = Math.random() * smogCanvas.height;
    }

    reset() {
        this.x = Math.random() * smogCanvas.width;
        this.y = smogCanvas.height + Math.random() * 100;
        this.size = Math.random() * 1.5 + 1;
        this.speedY = Math.random() * 0.4 + 0.1;
        this.speedX = (Math.random() - 0.5) * 0.2;
        this.color = `rgba(200, 200, 200, ${Math.random() * 0.3 + 0.1})`; // New light gray color
        this.blur = Math.random() * 3 + 1;
    }

    update() {
        this.y -= this.speedY;
        this.x += this.speedX;

        if (this.y < -this.size) {
            this.reset();
        }
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.shadowBlur = this.blur;
        ctx.shadowColor = `rgba(200, 200, 200, 0.5)`;
        ctx.fill();
    }
}

function initParticles() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
        particles.push(new SmogParticle());
    }
}

function animateSmog() {
    // Fills the canvas with a transparent layer to create a trailing effect
    // which mimics thick, swirling smog.
    ctx.clearRect(0, 0, smogCanvas.width, smogCanvas.height);

    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
    }
    requestAnimationFrame(animateSmog);
}

initParticles();
animateSmog();

window.addEventListener('resize', () => {
    smogCanvas.width = window.innerWidth;
    smogCanvas.height = window.innerHeight;
    initParticles();
});

// --- New Level Progress Logic ---
document.addEventListener('DOMContentLoaded', () => {
    checkLevelProgress();

    // Add event listeners to all level start buttons
    document.querySelectorAll('.level-start-btn').forEach(button => {
        button.addEventListener('click', (event) => {
            const levelId = event.target.id;
            console.log(`Starting ${levelId}...`);
            // You can replace this with a function that takes the user to the game
            // For now, we'll just simulate completing the level to unlock the next one.
            handleLevelComplete(parseInt(levelId.replace('start-', '')));
        });
    });

    // Add event listener for the Reset Progress button
    document.querySelector('.reset-progress').addEventListener('click', () => {
        localStorage.clear();
        checkLevelProgress();
        console.log("Progress reset!");
    });
});

function checkLevelProgress() {
    const completedLevels = JSON.parse(localStorage.getItem('completedLevels')) || [1];

    for (let i = 1; i <= 10; i++) {
        const levelItem = document.getElementById(`level-${i}`);
        const startButton = document.getElementById(`start-${i}`);

        if (completedLevels.includes(i)) {
            levelItem.classList.remove('locked');
            levelItem.classList.add('completed');
            startButton.disabled = false;
        } else {
            levelItem.classList.remove('completed');
            levelItem.classList.add('locked');
            startButton.disabled = true;
        }
    }
}

function handleLevelComplete(level) {
    let completedLevels = JSON.parse(localStorage.getItem('completedLevels')) || [];
    if (!completedLevels.includes(level)) {
        completedLevels.push(level);
        completedLevels.sort((a, b) => a - b);
        localStorage.setItem('completedLevels', JSON.stringify(completedLevels));
    }
    checkLevelProgress();
    
    // Simulate unlocking the next level
    const nextLevel = level + 1;
    if (nextLevel <= 10) {
        let nextCompletedLevels = JSON.parse(localStorage.getItem('completedLevels')) || [];
        if (!nextCompletedLevels.includes(nextLevel)) {
            nextCompletedLevels.push(nextLevel);
            nextCompletedLevels.sort((a, b) => a - b);
            localStorage.setItem('completedLevels', JSON.stringify(nextCompletedLevels));
            console.log(`Level ${level} completed! Level ${nextLevel} unlocked.`);
        }
    }
    checkLevelProgress();
}
