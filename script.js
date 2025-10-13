const quiz = [
  { question: "HTML là viết tắt của gì?", answers: ["HyperText Markup Language","HighText Machine Language","Hyperloop Machine Language"], correct: 0 },
  { question: "Ngôn ngữ nào chạy trong trình duyệt?", answers: ["Python","C++","JavaScript"], correct: 2 },
  { question: "CSS dùng để làm gì?", answers: ["Định dạng trang web","Kết nối DB","Chạy backend"], correct: 0 }
];

let current = 0;
let score = 0;

const questionEl = document.getElementById('question');
const answersEl = document.getElementById('answers');
const nextBtn = document.getElementById('next-btn');
const restartBtn = document.getElementById('restart-btn');
const resultEl = document.getElementById('result');

function renderQuestion(){
  const q = quiz[current];
  questionEl.textContent = `${current+1}. ${q.question}`;
  answersEl.innerHTML = '';
  q.answers.forEach((a,i)=>{
    const b = document.createElement('button');
    b.textContent = a;
    b.onclick = ()=> handleAnswer(i);
    answersEl.appendChild(b);
  });
  resultEl.textContent = '';
}

function handleAnswer(choice){
  const correct = quiz[current].correct;
  if(choice === correct){
    score++;
    resultEl.textContent = "✔️ Đúng!";
  } else {
    resultEl.textContent = `❌ Sai! Đáp án đúng: ${quiz[current].answers[correct]}`;
  }
  // disable buttons
  Array.from(answersEl.children).forEach(btn => btn.disabled = true);
  // show next or finish
  if(current < quiz.length - 1){
    nextBtn.style.display = 'inline-block';
  } else {
    nextBtn.style.display = 'none';
    restartBtn.style.display = 'inline-block';
    questionEl.textContent = `Kết thúc! Bạn được ${score}/${quiz.length} điểm.`;
  }
}

nextBtn.onclick = () => {
  current++;
  nextBtn.style.display = 'none';
  renderQuestion();
}

restartBtn.onclick = () => {
  current = 0;
  score = 0;
  restartBtn.style.display = 'none';
  nextBtn.style.display = 'none';
  renderQuestion();
}

// init
nextBtn.style.display = 'none';
renderQuestion();
