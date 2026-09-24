// ==========================================
// ១. Web Audio API សម្រាប់បង្កើត Sound Effects
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
    // សំឡេង ត្រូវ (Ding!)
    osc.type = "sine";
    osc.frequency.setValueAtTime(587.33, now);
    osc.frequency.setValueAtTime(880, now + 0.1);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
    osc.start(now);
    osc.stop(now + 0.4);
  } else if (type === "incorrect") {
    // សំឡេង ខុស (Buzz!)
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.setValueAtTime(110, now + 0.15);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
    osc.start(now);
    osc.stop(now + 0.4);
  } else if (type === "click") {
    // សំឡេង ចុចប៊ូតុង
    osc.type = "triangle";
    osc.frequency.setValueAtTime(400, now);
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
    osc.start(now);
    osc.stop(now + 0.05);
  } else if (type === "victory") {
    // សំឡេង ឈ្នះ/ចប់ (Fanfare)
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, index) => {
      const noteOsc = audioCtx.createOscillator();
      const noteGain = audioCtx.createGain();
      noteOsc.connect(noteGain);
      noteOsc.connect(audioCtx.destination);

      noteOsc.type = "sine";
      noteOsc.frequency.setValueAtTime(freq, now + index * 0.12);
      noteGain.gain.setValueAtTime(0.2, now + index * 0.12);
      noteGain.gain.exponentialRampToValueAtTime(
        0.001,
        now + index * 0.12 + 0.3,
      );

      noteOsc.start(now + index * 0.12);
      noteOsc.stop(now + index * 0.12 + 0.3);
    });
  }
}

// ==========================================
// ២. ទិន្នន័យសំណួរ (Quiz Data)
// ==========================================
const allQuestions = {
  networking: [
    {
      question:
        "តើ Protocol មួយណាដែលប្រើសម្រាប់កំណត់ IP Address ដោយស្វ័យប្រវត្តិ?",
      options: ["DNS", "DHCP", "FTP", "HTTP"],
      correct: 1,
    },
    {
      question: "តើ Port លេខប៉ុន្មានដែលត្រូវបានប្រើប្រាស់ដោយ HTTP?",
      options: ["21", "22", "80", "443"],
      correct: 2,
    },
    {
      question: "តើ Subnet Mask លំនាំដើមរបស់ Class C គឺអ្វី?",
      options: ["255.0.0.0", "255.255.0.0", "255.255.255.0", "255.255.255.255"],
      correct: 2,
    },
    {
      question: "តើ IP Address មួយណាជា Loopback Address (Localhost)?",
      options: ["192.168.1.1", "10.0.0.1", "127.0.0.1", "8.8.8.8"],
      correct: 2,
    },
  ],
  web: [
    {
      question: "តើកន្ទុយ File របស់ JavaScript គឺអ្វី?",
      options: [".css", ".html", ".js", ".php"],
      correct: 2,
    },
    {
      question: "តើ Tag មួយណាប្រើសម្រាប់បង្កើត Link ក្នុង HTML?",
      options: ["<a>", "<link>", "<href>", "<script>"],
      correct: 0,
    },
  ],
  hardware: [
    {
      question: "តើ RAM មកពីពាក្យពេញថាអ្វី?",
      options: [
        "Read Access Memory",
        "Random Access Memory",
        "Run Access Memory",
        "Real Access Memory",
      ],
      correct: 1,
    },
    {
      question: "តើឧបករណ៍មួយណាដែលត្រូវបានចាត់ទុកជា «ខួរក្បាល» របស់កុំព្យូទ័រ?",
      options: ["RAM", "Hard Disk", "CPU", "Power Supply"],
      correct: 2,
    },
    {
      question:
        "តើឧបករណ៍ល្បឿនលឿនមួយណាដែលប្រើសម្រាប់រក្សាទុកទិន្នន័យអចិន្ត្រៃយ៍ (Non-volatile)?",
      options: ["RAM", "SSD", "Cache Memory", "Registers"],
      correct: 1,
    },
    {
      question: "តើ Motherboard ជាអ្វី?",
      options: [
        "ឧបករណ៍ផ្គត់ផ្គង់ភ្លើង",
        "នាឡិកាក្នុងកុំព្យូទ័រ",
        "បេះដូងបូមខ្យល់",
        "ផ្ទាំងសៀគ្វីមេដែលភ្ជាប់គ្រឿងបន្លាស់ទាំងអស់ចូលគ្នា",
      ],
      correct: 3,
    },
    {
      question: "តើ GPU (Graphics Processing Unit) មានតួនាទីសំខាន់អ្វី?",
      options: [
        "រក្សាទុក File",
        "បង្កើនល្បឿនប្រលាក់រូបភាព និងវីដេអូ (Graphics)",
        "គ្រប់គ្រងបណ្តាញ អ៊ីនធឺណិត",
        "បញ្ចេញសំឡេង",
      ],
      correct: 1,
    },
    {
      question: "តើ Power Supply Unit (PSU) មានតួនាទីអ្វី?",
      options: [
        "បំប្លែង និងផ្គត់ផ្គង់ថាមពលអគ្គិសនីទៅគ្រឿងបន្លាស់កុំព្យូទ័រ",
        "បកប្រែកូដកម្មវិធី",
        "រក្សាទុកទិន្នន័យបណ្តោះអាសន្ន",
        "ត្រជាក់ CPU",
      ],
      correct: 0,
    },
    {
      question:
        "តើ Port មួយណាដែលគេនិយមប្រើបំផុតសម្រាប់តភ្ជាប់កង្ហារ ឬ Screen បង្ហាញរូបភាពទៅ Monitor?",
      options: ["USB-A", "HDMI", "RJ-45", "SATA"],
      correct: 1,
    },
    {
      question: "តើ BIOS / UEFI ត្រូវបានរក្សាទុកនៅលើ Chip ប្រភេទណា?",
      options: ["RAM", "Cache", "ROM / NVRAM", "CPU"],
      correct: 2,
    },
  ],
};

let currentQuizData = [];
let currentQuestion = 0;
let score = 0;
let userAnswers = [];
let timerInterval;
let timeLeft = 15;

// ==========================================
// ៣. Functions ដំណើរការ Quiz & LocalStorage
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  const savedScore = localStorage.getItem("quizHighScore") || 0;
  document.getElementById("high-score-display").innerText = savedScore;

  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light") {
    document.body.classList.add("light-mode");
    const themeBtn = document.getElementById("theme-toggle");
    if (themeBtn) themeBtn.innerText = "🌙 Mode";
  }
});

function startQuiz(category) {
  playSound("click");
  currentQuizData = allQuestions[category] || allQuestions.networking;
  currentQuestion = 0;
  score = 0;
  userAnswers = [];

  document.getElementById("category-screen").classList.add("hide");
  document.getElementById("quiz-screen").classList.remove("hide");
  loadQuiz();
}

function loadQuiz() {
  clearInterval(timerInterval);
  timeLeft = 15;
  document.getElementById("timer").innerText = `⏱️ ${timeLeft}s`;

  document.getElementById("question-count").innerText =
    `សំណួរ ${currentQuestion + 1} នៃ ${currentQuizData.length}`;
  document.getElementById("progress-bar").style.width =
    `${((currentQuestion + 1) / currentQuizData.length) * 100}%`;

  const data = currentQuizData[currentQuestion];
  document.getElementById("question").innerText =
    `${currentQuestion + 1}. ${data.question}`;

  const btns = document.querySelectorAll(".option-btn");
  btns.forEach((btn, i) => {
    btn.innerText = data.options[i];
    btn.classList.remove("correct", "incorrect", "disabled");
  });

  startTimer();
}

function startTimer() {
  timerInterval = setInterval(() => {
    timeLeft--;
    document.getElementById("timer").innerText = `⏱️ ${timeLeft}s`;
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      selectAnswer(-1);
    }
  }, 1000);
}

function selectAnswer(selectedIndex) {
  clearInterval(timerInterval);
  const correctIndex = currentQuizData[currentQuestion].correct;
  const btns = document.querySelectorAll(".option-btn");
  btns.forEach((btn) => btn.classList.add("disabled"));

  userAnswers.push({
    question: currentQuizData[currentQuestion].question,
    selected:
      selectedIndex >= 0
        ? currentQuizData[currentQuestion].options[selectedIndex]
        : "ផុតម៉ោង",
    correct: currentQuizData[currentQuestion].options[correctIndex],
    isCorrect: selectedIndex === correctIndex,
  });

  if (selectedIndex === correctIndex) {
    score++;
    playSound("correct");
    if (selectedIndex >= 0) btns[selectedIndex].classList.add("correct");
  } else {
    playSound("incorrect");
    if (selectedIndex >= 0) btns[selectedIndex].classList.add("incorrect");
    btns[correctIndex].classList.add("correct");
  }

  setTimeout(() => {
    currentQuestion++;
    if (currentQuestion < currentQuizData.length) {
      loadQuiz();
    } else {
      showResult();
    }
  }, 1000);
}

function showResult() {
  document.getElementById("quiz-screen").classList.add("hide");
  document.getElementById("result-screen").classList.remove("hide");
  document.getElementById("score-text").innerText =
    `អ្នកឆ្លើយត្រូវ ${score} ក្នុងចំណោម ${currentQuizData.length} សំណួរ!`;

  playSound("victory");

  const savedScore = localStorage.getItem("quizHighScore") || 0;
  if (score > savedScore) {
    localStorage.setItem("quizHighScore", score);
    document.getElementById("high-score-display").innerText = score;
    document.getElementById("new-record-text").classList.remove("hide");
  } else {
    document.getElementById("new-record-text").classList.add("hide");
  }

  if (score === currentQuizData.length) {
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
  }
}

function toggleReview() {
  playSound("click");
  const container = document.getElementById("review-container");
  const list = document.getElementById("review-list");

  if (container.classList.contains("hide")) {
    list.innerHTML = "";
    userAnswers.forEach((item, index) => {
      list.innerHTML += `
                <div class="review-item">
                    <p><strong>${index + 1}. ${item.question}</strong></p>
                    <p class="${item.isCorrect ? "review-correct" : "review-wrong"}">
                        ចម្លើយរបស់អ្នក៖ ${item.selected} ${item.isCorrect ? "✓" : "✗"}
                    </p>
                    ${!item.isCorrect ? `<p class="review-correct">ចម្លើយត្រូវ៖ ${item.correct}</p>` : ""}
                </div>
            `;
    });
    container.classList.remove("hide");
  } else {
    container.classList.add("hide");
  }
}

function restartQuiz() {
  playSound("click");
  document.getElementById("result-screen").classList.add("hide");
  document.getElementById("review-container").classList.add("hide");
  document.getElementById("category-screen").classList.remove("hide");
}

function toggleTheme() {
  playSound("click");
  document.body.classList.toggle("light-mode");
  const themeBtn = document.getElementById("theme-toggle");

  if (document.body.classList.contains("light-mode")) {
    themeBtn.innerText = "🌙 Mode";
    localStorage.setItem("theme", "light");
  } else {
    themeBtn.innerText = "☀️ Mode";
    localStorage.setItem("theme", "dark");
  }
}
