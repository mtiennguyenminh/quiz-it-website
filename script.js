const questionEl = document.getElementById('question');
const answersEl = document.getElementById('answers');
const nextBtn = document.getElementById('next-btn');
const restartBtn = document.getElementById('restart-btn');
const resultEl = document.getElementById('result');

let current = 0;
let score = 0;
let quiz = [];

// Hàm gọi API lấy câu hỏi
async function loadQuestions() {
  questionEl.textContent = "⏳ Đang tải câu hỏi...";
  try {
    const res = await fetch("https://opentdb.com/api.php?amount=10&category=18&type=multiple");
    const data = await res.json();
    quiz = data.results.map(q => {
      const answers = [...q.incorrect_answers];
      const randomIndex = Math.floor(Math.random() * (answers.length + 1));
      answers.splice(randomIndex, 0, q.correct_answer);
      return {
        question: decodeHTMLEntities(q.question),
        answers: answers.map(decodeHTMLEntities),
        correct: randomIndex
      };
    });
    current = 0;
    score = 0;
    renderQuestion();
  } catch (e) {
    questionEl.textContent = "❌ Lỗi tải dữ liệu. Vui lòng tải lại trang.";
    console.error(e);
  }
}

function decodeHTMLEntities(str) {
  const txt = document.createElement("textarea");
  txt.innerHTML = str;
  return txt.value;
}

function renderQuestion(){
  const q = quiz[current];
  const letters = ['A', 'B', 'C', 'D'];
  questionEl.textContent = `${current+1}. ${q.question}`;
  answersEl.innerHTML = '';
  q.answers.forEach((a,i)=>{
    const b = document.createElement('button');
    b.textContent = `${letters[i]}. ${a}`;
    b.onclick = ()=> handleAnswer(i);
    answersEl.appendChild(b);
  });
  resultEl.textContent = '';
  nextBtn.style.display = 'none';
  restartBtn.style.display = 'none';
}

function handleAnswer(choice){
  const correct = quiz[current].correct;
  if(choice === correct){
    score++;
    resultEl.textContent = "✔️ Đúng!";
  } else {
    resultEl.textContent = `❌ Sai! Đáp án đúng: ${quiz[current].answers[correct]}`;
  }
  Array.from(answersEl.children).forEach(btn => btn.disabled = true);
  if(current < quiz.length - 1){
    nextBtn.style.display = 'inline-block';
  } else {
    questionEl.textContent = `Kết thúc! Bạn được ${score}/${quiz.length} điểm 🎉`;
    answersEl.innerHTML = '';
    nextBtn.style.display = 'none';
    restartBtn.style.display = 'inline-block';
  }
}

nextBtn.onclick = () => {
  current++;
  renderQuestion();
};

restartBtn.onclick = () => {
  loadQuestions();
};

loadQuestions();
