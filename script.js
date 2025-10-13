let username = "";
let questions = [];
let current = 0;
let score = 0;
let timer;
let timeLeft = 10;

// Bắt đầu bài trắc nghiệm
function startQuiz() {
  username = document.getElementById("username").value.trim();
  if (!username) return alert("Nhập tên trước khi bắt đầu!");
  document.getElementById("login").style.display = "none";
  document.getElementById("quiz").style.display = "block";
  loadQuestions();
}

// Lấy câu hỏi từ API public
async function loadQuestions() {
  try {
    // Dùng Open Trivia DB (nguồn free và có API)
    const res = await fetch("https://opentdb.com/api.php?amount=20&category=18&type=multiple");
    const data = await res.json();

    // Random chọn 10 câu
    questions = data.results.sort(() => 0.5 - Math.random()).slice(0, 10);
    showQuestion();
  } catch (err) {
    alert("Không thể tải câu hỏi. Kiểm tra kết nối mạng!");
  }
}

// Hiển thị câu hỏi
function showQuestion() {
  if (current >= questions.length) return finishQuiz();
  const q = questions[current];

  // Trộn đáp án
  const options = [...q.incorrect_answers];
  const correctIndex = Math.floor(Math.random() * 4);
  options.splice(correctIndex, 0, q.correct_answer);

  const container = document.getElementById("question-container");
  container.innerHTML = `
    <h3>${current + 1}. ${decode(q.question)}</h3>
    ${options.map((opt, i) =>
      `<div class="option" onclick="selectAnswer(${i}, ${correctIndex})">
         ${String.fromCharCode(65+i)}. ${decode(opt)}
       </div>`).join("")}
  `;

  // Reset thời gian
  timeLeft = 10;
  document.getElementById("time").textContent = timeLeft;
  clearInterval(timer);
  timer = setInterval(() => {
    timeLeft--;
    document.getElementById("time").textContent = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(timer);
      nextQuestion();
    }
  }, 1000);
}

// Chọn đáp án
function selectAnswer(index, correct) {
  clearInterval(timer);
  if (index === correct) score++;
  nextQuestion();
}

function nextQuestion() {
  current++;
  showQuestion();
}

// Kết thúc bài trắc nghiệm
function finishQuiz() {
  document.getElementById("quiz").style.display = "none";
  document.getElementById("result").style.display = "block";
  document.getElementById("leaderboard").style.display = "block";
  document.getElementById("score").textContent = `${username}, bạn được ${score}/${questions.length} điểm.`;
  saveToLeaderboard();
  renderLeaderboard();
}

// Lưu điểm top 10 trong localStorage
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
  table.innerHTML = "<tr><th>Hạng</th><th>Tên</th><th>Điểm</th></tr>";
  board.forEach((p, i) => {
    table.innerHTML += `<tr><td>${i + 1}</td><td>${p.name}</td><td>${p.score}</td></tr>`;
  });
}

function restart() {
  location.reload();
}

// Giúp hiển thị ký tự HTML (ví dụ: &quot; → “)
function decode(str) {
  const txt = document.createElement("textarea");
  txt.innerHTML = str;
  return txt.value;
}
