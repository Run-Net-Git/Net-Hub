// ==========================================
// Web Audio API សម្រាប់បង្កើតសំឡេង (Sound Effects)
// ==========================================
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playSound(type) {
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);

  const now = audioCtx.currentTime;

  if (type === "correct") {
    // សំឡេងឆ្លើយត្រូវ (Ding-Ding!)
    osc.type = "sine";
    osc.frequency.setValueAtTime(523.25, now); // C5
    osc.frequency.setValueAtTime(659.25, now + 0.1); // E5
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
    osc.start(now);
    osc.stop(now + 0.3);
  } else if (type === "wrong") {
    // សំឡេងឆ្លើយខុស (Buzzer)
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.setValueAtTime(110, now + 0.15);
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
    osc.start(now);
    osc.stop(now + 0.35);
  } else if (type === "timeout") {
    // សំឡេងអស់ពេល
    osc.type = "square";
    osc.frequency.setValueAtTime(200, now);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
    osc.start(now);
    osc.stop(now + 0.4);
  } else if (type === "win") {
    // សំឡេងឈ្នះ/ទទួលបានលទ្ធផលល្អ (Fanfare)
    const notes = [261.63, 329.63, 392.0, 523.25]; // C4, E4, G4, C5
    notes.forEach((freq, index) => {
      const noteOsc = audioCtx.createOscillator();
      const noteGain = audioCtx.createGain();
      noteOsc.connect(noteGain);
      noteGain.connect(audioCtx.destination);

      noteOsc.type = "triangle";
      noteOsc.frequency.setValueAtTime(freq, now + index * 0.12);
      noteGain.gain.setValueAtTime(0.3, now + index * 0.12);
      noteGain.gain.exponentialRampToValueAtTime(
        0.01,
        now + index * 0.12 + 0.3,
      );

      noteOsc.start(now + index * 0.12);
      noteOsc.stop(now + index * 0.12 + 0.3);
    });
  }
}

// ==========================================
// ទិន្នន័យសំណួរ (Quiz Data)
// ==========================================
const quizData = {
  networking: [
    {
      question: "១. តើ IP Address ប្រភេទ IPv4 មានប្រវែងប៉ុន្មាន Bit?",
      options: ["16 Bits", "32 Bits", "64 Bits", "128 Bits"],
      correct: 1,
    },
    {
      question: "២. តើ Port 80 ប្រើប្រាស់សម្រាប់ Protocol មួយណា?",
      options: ["FTP", "SSH", "HTTP", "HTTPS"],
      correct: 2,
    },
    {
      question: "៣. តើឧបករណ៍មួយណាប្រើសម្រាប់តភ្ជាប់បណ្តាញ Network ខុសៗគ្នា?",
      options: ["Switch", "Hub", "Router", "Repeater"],
      correct: 2,
    },
    {
      question: "៤. តើ Subnet Mask ដើមរបស់ Class C គឺអ្វី?",
      options: ["255.0.0.0", "255.255.0.0", "255.255.255.0", "255.255.255.255"],
      correct: 2,
    },
  ],
  webdev: [
    {
      question: "១. តើ HTML មកពីពាក្យពេញថាអ្វី?",
      options: [
        "Hyper Text Markup Language",
        "High Tech Modern Language",
        "Hyperlink Text Mode Link",
        "Home Tool Markup Language",
      ],
      correct: 0,
    },
    {
      question: "២. តើ Property មួយណាក្នុង CSS ប្រើសម្រាប់ដូរពណ៌អក្សរ?",
      options: ["text-color", "color", "font-color", "background-color"],
      correct: 1,
    },
    {
      question:
        "៣. តើ Keyword មួយណាដែលប្រកាស Variable មិនអាចផ្លាស់ប្តូរតម្លៃបាន?",
      options: ["let", "var", "const", "static"],
      correct: 2,
    },
  ],
  hardware: [
    {
      question: "១. សមាសភាគកុំព្យូទ័រមួយណាដែលដើរតួជា «ខួរក្បាល»?",
      options: ["RAM", "Hard Disk", "CPU", "Power Supply"],
      correct: 2,
    },
    {
      question: "២. តើ RAM ជាប្រភេទ Memory បែបណា?",
      options: [
        "Volatile (បាត់ទិន្នន័យពេលបិទភ្លើង)",
        "Non-Volatile",
        "Permanent Storage",
        "Optical Storage",
      ],
      correct: 0,
    },
  ],
};

let currentCategory = [];
let currentQuestionIndex = 0;
let score = 0;
let timer = null;
let timeLeft = 15;
let isFiftyFiftyUsed = false;

const categoryScreen = document.getElementById("category-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");
const questionText = document.getElementById("question-text");
const optionsContainer = document.getElementById("options-container");
const questionCount = document.getElementById("question-count");
const timerDisplay = document.getElementById("timer");
const fiftyFiftyBtn = document.getElementById("fifty-fifty-btn");
const scoreText = document.getElementById("score-text");
const feedbackText = document.getElementById("feedback-text");
const highScoreElement = document.getElementById("high-score");

let highScore = localStorage.getItem("quizHighScore") || 0;
if (highScoreElement) highScoreElement.innerText = highScore;

function startQuiz(categoryKey) {
  currentCategory = quizData[categoryKey] || quizData.networking;
  currentQuestionIndex = 0;
  score = 0;
  isFiftyFiftyUsed = false;

  categoryScreen.classList.add("hide");
  resultScreen.classList.add("hide");
  quizScreen.classList.remove("hide");

  loadQuestion();
}

function loadQuestion() {
  clearInterval(timer);
  timeLeft = 15;
  startTimer();

  const currentQuiz = currentCategory[currentQuestionIndex];
  questionText.innerText = currentQuiz.question;
  questionCount.innerText = `សំណួរ ${currentQuestionIndex + 1} នៃ ${currentCategory.length}`;

  optionsContainer.innerHTML = "";
  currentQuiz.options.forEach((option, index) => {
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.innerText = option;
    btn.onclick = () => selectAnswer(index, btn);
    optionsContainer.appendChild(btn);
  });

  if (fiftyFiftyBtn) {
    fiftyFiftyBtn.disabled = isFiftyFiftyUsed;
    fiftyFiftyBtn.style.opacity = isFiftyFiftyUsed ? "0.5" : "1";
  }
}

function startTimer() {
  timerDisplay.innerText = `⏰ ${timeLeft}s`;
  timer = setInterval(() => {
    timeLeft--;
    timerDisplay.innerText = `⏰ ${timeLeft}s`;
    if (timeLeft <= 0) {
      clearInterval(timer);
      playSound("timeout"); // 🔊 លោតសំឡេងអស់ពេល
      nextQuestion();
    }
  }, 1000);
}

function selectAnswer(selectedIndex, selectedBtn) {
  clearInterval(timer);
  const currentQuiz = currentCategory[currentQuestionIndex];
  const allBtns = optionsContainer.querySelectorAll(".option-btn");

  allBtns.forEach((btn) => (btn.disabled = true));

  if (selectedIndex === currentQuiz.correct) {
    selectedBtn.style.background = "#28a745";
    selectedBtn.style.color = "#fff";
    score++;
    playSound("correct"); // 🔊 លោតសំឡេងឆ្លើយត្រូវ
  } else {
    selectedBtn.style.background = "#dc3545";
    selectedBtn.style.color = "#fff";
    if (allBtns[currentQuiz.correct]) {
      allBtns[currentQuiz.correct].style.background = "#28a745";
      allBtns[currentQuiz.correct].style.color = "#fff";
    }
    playSound("wrong"); // 🔊 លោតសំឡេងឆ្លើយខុស
  }

  setTimeout(nextQuestion, 1200);
}

function nextQuestion() {
  currentQuestionIndex++;
  if (currentQuestionIndex < currentCategory.length) {
    loadQuestion();
  } else {
    showResult();
  }
}

function useFiftyFifty() {
  if (isFiftyFiftyUsed) return;
  isFiftyFiftyUsed = true;
  fiftyFiftyBtn.disabled = true;
  fiftyFiftyBtn.style.opacity = "0.5";

  const currentQuiz = currentCategory[currentQuestionIndex];
  const allBtns = optionsContainer.querySelectorAll(".option-btn");
  let wrongIndexes = [];

  currentQuiz.options.forEach((_, idx) => {
    if (idx !== currentQuiz.correct) wrongIndexes.push(idx);
  });

  wrongIndexes
    .sort(() => 0.5 - Math.random())
    .slice(0, 2)
    .forEach((idx) => {
      if (allBtns[idx]) allBtns[idx].style.visibility = "hidden";
    });
}

function showResult() {
  clearInterval(timer);
  quizScreen.classList.add("hide");
  resultScreen.classList.remove("hide");

  scoreText.innerText = `អ្នកទទួលបាន ${score} / ${currentCategory.length} ពិន្ទុ!`;

  if (score > highScore) {
    highScore = score;
    localStorage.setItem("quizHighScore", highScore);
    if (highScoreElement) highScoreElement.innerText = highScore;
  }

  if (score === currentCategory.length) {
    feedbackText.innerText = "🎉 អស្ចារ្យណាស់! អ្នកឆ្លើយត្រូវទាំងអស់!";
    playSound("win"); // 🔊 លោតសំឡេងឈ្នះ
  } else if (score >= currentCategory.length / 2) {
    feedbackText.innerText = "👍 ល្អណាស់! អ្នកធ្វើបានគ្រាន់បើ។";
    playSound("win");
  } else {
    feedbackText.innerText = "💪 ខិតខំប្រឹងប្រែងបន្ថែមទៀតណា!";
    playSound("wrong");
  }
}

function restartQuiz() {
  clearInterval(timer);
  resultScreen.classList.add("hide");
  quizScreen.classList.add("hide");
  categoryScreen.classList.remove("hide");
}
