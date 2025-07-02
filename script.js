const circle = document.getElementById("circle");
const scoreDisplay = document.getElementById("score");
const timerDisplay = document.getElementById("timer");
const restartBtn = document.getElementById("restartBtn");
const gameContainer = document.querySelector(".game-container");
const bonusSound = document.getElementById("bonus-sound");
const wordHolder = document.getElementById("wordHolder");

const textContent = [
  '0', '1', '2', '1', '0',
  '1', '2', '4', '2', '1',
  '2', '4', '8', '4', '2',
  '1', '2', '4', '2', '1',
  '0', '1', '2', '1', '0',
];

const correctWords = [
  "Triceratops was a herbivorous dinosaur.",
  "The first fossil evidence of birds dates back to the late Jurassic.",
  "Paleontologists study fossils to understand ancient life forms.",
  "Fossils can be found in sedimentary rock layers.",
  "Tyrannosaurus rex was a carnivorous dinosaur.",
  "The oldest known fossils are over 3.5 billion years old.",
  "Some fossils are preserved as petrified wood.",
  "Fossils of early mammals have been found in the Cenozoic era.",
  "The study of fossils helps us understand Earth's history.",
  "Ammonites are extinct marine mollusks known for their spiral shells.",
  "Fossils of dinosaurs help reconstruct past ecosystems.",
  "Paleontologists use carbon dating to estimate the age of fossils.",
  "The fossilized remains of ancient plants can also provide valuable information.",
  "Fossil footprints are valuable clues about animal behavior.",
  "Mammoths were closely related to modern elephants.",
  "A fossil can be a bone, tooth, shell, or even a footprint.",
  "Fossils found in amber are well-preserved and contain detailed evidence.",
  "The study of fossilized pollen is called palynology.",
  "The fossil record is incomplete due to the conditions required for fossilization.",
  "The first dinosaurs appeared during the Triassic period."
];

const incorrectWords = [
  "Triceratops was a carnivorous dinosaur.",
  "The first fossil evidence of birds dates back to the Mesozoic.",
  "Paleontologists study rocks to understand ancient life forms.",
  "Fossils can be found in igneous rock layers.",
  "Tyrannosaurus rex was a herbivorous dinosaur.",
  "The oldest known fossils are only 1 billion years old.",
  "Some fossils are preserved as petrified plants.",
  "Fossils of early mammals have been found in the Mesozoic era.",
  "The study of fossils has no relation to Earth's history.",
  "Ammonites are extinct reptiles known for their spiral shells.",
  "Fossils of birds help reconstruct past ecosystems.",
  "Paleontologists use uranium dating to estimate the age of fossils.",
  "The fossilized remains of modern plants can provide valuable information.",
  "Fossil footprints are mostly random markings with no behavior clues.",
  "Mammoths were related to modern rhinoceroses.",
  "A fossil can only be a tooth or bone.",
  "Fossils found in amber are poorly preserved.",
  "The study of fossilized pollen is called paleobotany.",
  "The fossil record is complete due to widespread fossilization.",
  "The first dinosaurs appeared during the Permian period."
];


let currentWord = "";
let score = 0;
let awarded_15 = false;
let awarded_30 = false;
let awarded_60 = false;
let timeLeft = 120;
let gameInterval;
let timerInterval;
let bonusMessageVisible = false;
let lastClickedTextValue = 0;
const normalSize = 120;

// === INSTRUCTION OVERLAY TRIGGER ===
window.onload = () => {
  document.getElementById("instructionsOverlay").style.display = "flex";
};

// === CALLED ON OK BUTTON PRESS ===
function startGameWithOverlay() {
  document.getElementById("instructionsOverlay").style.display = "none";
  startGame();
}

function createGrid() {
  const grid = document.querySelector('.grid');
  grid.innerHTML = '';
  for (let i = 0; i < 25; i++) {
    const square = document.createElement('div');
    square.classList.add('square');

    const span = document.createElement('span');
    span.textContent = textContent[i];
    square.appendChild(span);

    square.addEventListener('click', function () {
      square.classList.add('clicked');
      lastClickedTextValue = parseInt(span.textContent);
    });

    grid.appendChild(square);
  }
}

function getRandomWord() {
  if (Math.random() < 0.5) {
    currentWord = correctWords[Math.floor(Math.random() * correctWords.length)];
  } else {
    currentWord = incorrectWords[Math.floor(Math.random() * incorrectWords.length)];
  }
  return currentWord;
}

function showBonusMessage(message, color) {
  if (bonusMessageVisible) return;
  bonusMessageVisible = true;

  const bonusMessage = document.createElement('div');
  bonusMessage.classList.add('bonus-message');
  bonusMessage.textContent = message;
  bonusMessage.style.color = color;
  document.body.appendChild(bonusMessage);

  setTimeout(() => {
    bonusMessage.remove();
    bonusMessageVisible = false;
  }, 3000);
}

function startGame() {
  createGrid();
  score = 0;
  timeLeft = 120;
  awarded_15 = false;
  awarded_30 = false;
  awarded_60 = false;

  scoreDisplay.textContent = `Score: ${score}`;
  timerDisplay.textContent = `Time: ${timeLeft}s`;
  restartBtn.style.display = "none";

  wordHolder.style.cursor = "pointer";
  wordHolder.style.pointerEvents = "auto";

  wordHolder.textContent = getRandomWord();
  wordHolder.onclick = handleWordClick;

  // === Word changes every 5 seconds ===
  gameInterval = setInterval(() => {
    currentWord = getRandomWord();
    wordHolder.textContent = currentWord;
  }, 5000);

  timerInterval = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = `Time: ${timeLeft}s`;
    if (timeLeft <= 0) {
      endGame();
    }
  }, 1000);
}

function endGame() {
  clearInterval(gameInterval);
  clearInterval(timerInterval);
  circle.style.display = "none";
  restartBtn.style.display = "inline-block";
  timerDisplay.textContent = `Game Over! Final Score: ${score}`;
}

function createFireworks() {
  const fireworksContainer = document.createElement("div");
  fireworksContainer.classList.add("fireworks");

  for (let i = 0; i < 10; i++) {
    const spark = document.createElement("div");
    spark.classList.add("firework-spark");
    const angle = Math.random() * 360;
    const distance = Math.random() * 50 + 50;
    const duration = Math.random() * 0.5 + 1;
    spark.style.animationDuration = `${duration}s`;

    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;
    spark.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`;

    fireworksContainer.appendChild(spark);
  }

  document.body.appendChild(fireworksContainer);

  setTimeout(() => {
    fireworksContainer.remove();
  }, 2000);
}

function checkScoreForFireworks() {
  if (score === 15 && !awarded_15) {
    createFireworks();
    showBonusMessage("TIME-BONUS! 15s", "gold");
    timeLeft += 15;
    awarded_15 = true;
    bonusSound.currentTime = 0;
    bonusSound.play();
  }
  if (score === 30 && !awarded_30) {
    createFireworks();
    showBonusMessage("TIME-BONUS! 30s", "gold");
    timeLeft += 30;
    awarded_30 = true;
    bonusSound.currentTime = 0;
    bonusSound.play();
  }
  if (score === 60 && !awarded_60) {
    createFireworks();
    showBonusMessage("TIME-BONUS! 60s", "gold");
    timeLeft += 60;
    awarded_60 = true;
    bonusSound.currentTime = 0;
    bonusSound.play();
  }
}

function handleWordClick() {
  let hoverText = document.createElement("div");
  hoverText.classList.add("hover-feedback");

  const correctSound = document.getElementById("correct-sound");
  const clickSound = document.getElementById("click-sound");

  if (correctWords.includes(currentWord)) {
    score++;
    score += lastClickedTextValue;
    correctSound.currentTime = 0;
    correctSound.play();
    showBonusMessage("Correct!", "green");
    hoverText.textContent = "Good!";
    hoverText.style.color = "green";
  } else if (incorrectWords.includes(currentWord)) {
    score--;
    score -= lastClickedTextValue;
    clickSound.currentTime = 0;
    clickSound.play();
    showBonusMessage("Oops! That's a misspelling!", "red");
    hoverText.textContent = "Ouch!!!!";
    hoverText.style.color = "red";
  }

  const wordRect = wordHolder.getBoundingClientRect();
  hoverText.style.position = "absolute";
  hoverText.style.left = `${wordRect.left + wordRect.width / 2}px`;
  hoverText.style.top = `${wordRect.top - 20}px`;
  hoverText.style.transform = "translateX(-50%)";
  hoverText.style.fontWeight = "bold";
  hoverText.style.fontSize = "20px";
  hoverText.style.pointerEvents = "none";
  hoverText.style.zIndex = "1000";
  hoverText.style.transition = "opacity 1s ease-out, transform 1s ease-out";
  hoverText.style.opacity = "1";

  document.body.appendChild(hoverText);

  setTimeout(() => {
    hoverText.style.opacity = "0";
    hoverText.style.transform = "translateX(-50%) translateY(-30px)";
  }, 50);

  setTimeout(() => {
    hoverText.remove();
  }, 1000);

  scoreDisplay.textContent = `Score: ${score}`;
  checkScoreForFireworks();

  // Load next word immediately after click
  currentWord = getRandomWord();
  wordHolder.textContent = currentWord;
}

restartBtn.addEventListener("click", startGame);
