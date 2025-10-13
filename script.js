// =======================================
// WEBSITE TRẮC NGHIỆM KIẾN THỨC IT
// =======================================

let username = "";
let questions = [];
let currentIndex = 0;
let score = 0;
let timer;
let timeLeft = 10;

// ====================
// 1. BẮT ĐẦU TRẮC NGHIỆM
// ====================
function startQuiz() {
  const input = document.getElementById("username");
  username = input.value.trim();

  if (!username) {
    alert("Vui lòng nhập tên trước khi bắt đầu!");
    input.focus();
    return;
  }

  document.getElementById("login").style.display = "none";
  document.getElementById("quiz").style.display = "block";

  loadQuestions();
}

// ====================
// 2. LẤY CÂU HỎI TỪ API
// ====================
async function loadQuestions() {
  try {
    const res = await fetch("https://opentdb.com/api.php?amount=20&category=18&type=multiple");
    const data = await res.json();

    // Chọn ngẫu nhiên 10 câu trong 20 câu nhận được
    questions = data.results.sort(() => Math.random() - 0.5).slice(0, 10);
    currentIndex = 0;
    score = 0;
    showQuestion();
  } catch (err) {
    alert("Không thể tải câu hỏi. Vui lòng kiểm tra kết nối mạng!");
  }
}

// ====================
// 3. HIỂN THỊ CÂU HỎI
// ====================
function showQuestion() {
  if (currentIndex >= questions.length) return finishQuiz();

  const q = questions[currentIndex];
  const container = document.getElementById("question-container");

  // Trộn đáp án ngẫu nhiên
  const answers = [...q.incorrect_answers];
  const correctIndex = Math.floor(Math.random() * 4);
  answers.splice(correctIndex, 0, q.correct_answer);

  // Render giao diện câu hỏi
  container.innerHTML = `
    <div class="question fade-in">
      <h3>${currentIndex + 1}. ${decode(q.question)}</h3>
      ${answers
        .map(
          (opt, i) => `
        <div class="option" onclick="selectAnswer(${i}, ${correctIndex})">
          <b>${String.fromCharCode(65 + i)}.</b> ${decode(opt)}
        </div>`
        )
        .join("")}
    </div>
  `;

  // Bắt đầu đếm ngược
  startTimer();
}

// ====================
// 4. ĐẾM NGƯỢC MỖI CÂU
// ====================
function startTimer() {
  clearInterval(timer);
  timeLeft = 10;
  const timeEl = document.getElementById("time");
  timeEl.textContent = timeLeft;

  timer = setInterval(() => {
    timeLeft--;
    timeEl.textContent = timeLeft;

    if (timeLeft <= 0) {
      clearInterval(timer);
      nextQuestion();
    }
  }, 1000);
}

// ====================
// 5. CHỌN ĐÁP ÁN
// ====================
function selectAnswer(index, correctIndex) {
  clearInterval(timer);

  if (index === correctIndex) score++;

  // Hiển thị phản hồi ngắn trước khi sang câu kế
  const options = document.querySelectorAll(".option");
  options.forEach((opt, i) => {
    opt.style.pointerEvents = "none";
    opt.style.background = i === correctIndex ? "#4cd137" : "#e84118";
    opt.style.color = "#fff";
  });

  setTimeout(nextQuestion, 800);
}

// ====================
// 6. CHUYỂN CÂU TIẾP
// ====================
function nextQuestion() {
  currentIndex++;
  showQuestion();
}

// ====================
// 7. KẾT THÚC BÀI LÀM
// ====================
function finishQuiz() {
  clearInterval(timer);
  document.getElementById("quiz").style.display = "none";
  document.getElementById("result").style.display = "block";
  document.getElementById("leaderboard").style.display = "block";

  document.getElementById("score").textContent = 
    `${username}, bạn đạt ${score}/${questions.length} điểm.`;

  saveToLeaderboard();
  renderLeaderboard();
}

// ====================
// 8. LƯU & HIỂN THỊ BẢNG XẾP HẠNG
// ====================
function saveToLeaderboard() {
  let board = JSON.parse(localStorage.getItem("leaderboard") || "[]");

  board.push({ name: username, score });
  board.sort((a, b) => b.score - a.score);
  board = board.slice(0, 10);

  localStorage.setItem("leaderboard", JSON.stringify(board));
}

function renderLeaderboard() {
  const board = JSON.parse(localStorage.getItem("leaderboard") || "[]");
  const table = document.getElementById("board");

  table.innerHTML = `
    <tr>
      <th>Hạng</th>
      <th>Tên người chơi</th>
      <th>Điểm</th>
    </tr>
  `;

  board.forEach((player, i) => {
    table.innerHTML += `
      <tr>
        <td>${i + 1}</td>
        <td>${player.name}</td>
        <td>${player.score}</td>
      </tr>
    `;
  });
}

// ====================
// 9. LÀM LẠI
// ====================
function restart() {
  location.reload();
}

// ====================
// **** HÀM HỖ TRỢ: GIẢI MÃ HTML ENTITIES
// ====================
function decode(str) {
  const txt = document.createElement("textarea");
  txt.innerHTML = str;
  return txt.value;
}
