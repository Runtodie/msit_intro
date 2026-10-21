/**
 * 과학기술정보통신부 인터랙티브 웹 앱 스크립트 (Pure Vanilla JS)
 * 서버나 번들러 없이 브라우저에서 독립 실행됩니다.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Lucide 아이콘 렌더링
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // 2. 핵심 4대 업무 인터랙티브 탭 전환
  initMissionTabs();

  // 3. 최신 뉴스 카테고리 필터링
  initNewsFilter();

  // 4. 국민 맞춤 지원 찾기 (Checklist & Finder)
  initSupportFinder();

  // 5. 국민 이해도 쏙쏙 퀴즈 위젯
  initQuiz();
});

/* ----------------------------------------------------
   1. 핵심 업무 탭 제어
   ---------------------------------------------------- */
function initMissionTabs() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTabId = btn.getAttribute('data-tab');

      // 기존 active 제거
      tabButtons.forEach(b => b.classList.remove('active'));
      tabPanes.forEach(pane => pane.classList.remove('active'));

      // 신규 active 추가
      btn.classList.add('active');
      const targetPane = document.getElementById(targetTabId);
      if (targetPane) {
        targetPane.classList.add('active');
        // 아이콘 리프레시
        if (window.lucide) {
          window.lucide.createIcons();
        }
      }
    });
  });
}

/* ----------------------------------------------------
   2. 뉴스 카테고리 필터링
   ---------------------------------------------------- */
function initNewsFilter() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const newsCards = document.querySelectorAll('.news-card');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // 버튼 상태
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.getAttribute('data-filter');

      newsCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterVal === 'all' || category === filterVal) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.3s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ----------------------------------------------------
   3. 국민 상식 미니 퀴즈
   ---------------------------------------------------- */
const QUIZ_DATA = [
  {
    question: "Q1. 과학기술정보통신부가 총력을 기울여 추진하는 대한민국 인공지능 미래 비전은 무엇일까요?",
    options: [
      "AI G3 (글로벌 3대 AI 강국) 도약",
      "인터넷 보급률 100% 달성",
      "전자기기 배터리 수명 2배 연장",
      "국민 스마트폰 전량 무상 교체"
    ],
    correctIndex: 0,
    explanation: "정답입니다! 정부는 대한민국을 글로벌 3대 AI 강국(AI G3)으로 도약시키기 위해 국가 AI 인프라 확충과 인재 양성에 총력을 다하고 있습니다."
  },
  {
    question: "Q2. 기존 슈퍼컴퓨터로 수백만 년 걸릴 복잡한 계산을 단 몇 분 만에 풀어낼 차세대 게임체인저 기술은?",
    options: [
      "블루투스 5.0 기술",
      "양자(Quantum) 컴퓨팅 기술",
      "초고화질 8K 디스플레이",
      "무선 고속 충전 기술"
    ],
    correctIndex: 1,
    explanation: "정답입니다! 과학기술정보통신부는 2026년 정부 첫 '양자 마스터플랜'을 선포하고 양자컴퓨터, 양자암호통신 개발을 집중 지원하고 있습니다."
  },
  {
    question: "Q3. 과기정통부에서 국민의 안전한 일상을 지키기 위해 지원하는 '디지털 안심망' 업무가 아닌 것은?",
    options: [
      "보이스피싱 및 악성 스미싱 문자 원천 차단",
      "어르신·취약계층을 위한 디지털 배움터 운영",
      "해킹 방어를 위한 양자내성암호(PQC) 실증",
      "전국 대중교통 버스 요금 인상 심의"
    ],
    correctIndex: 3,
    explanation: "정답입니다! 버스 요금 등의 대중교통 요금 심의는 지방자치단체 및 국토교통부 소관이며, 과기정통부는 보이스피싱 차단, 사이버 보안, 디지털 격차 해소(배움터) 등을 담당합니다."
  }
];

let currentQuizIdx = 0;
let userScore = 0;

function initQuiz() {
  renderQuestion(currentQuizIdx);

  const btnNext = document.getElementById('btnNextQuiz');
  const btnRestart = document.getElementById('btnRestartQuiz');

  if (btnNext) {
    btnNext.addEventListener('click', () => {
      currentQuizIdx++;
      if (currentQuizIdx < QUIZ_DATA.length) {
        renderQuestion(currentQuizIdx);
      } else {
        renderQuizResult();
      }
    });
  }

  if (btnRestart) {
    btnRestart.addEventListener('click', () => {
      currentQuizIdx = 0;
      userScore = 0;
      renderQuestion(currentQuizIdx);
    });
  }
}

function renderQuestion(idx) {
  const qData = QUIZ_DATA[idx];
  const qStep = document.getElementById('qStep');
  const qTitle = document.getElementById('qTitle');
  const qOptions = document.getElementById('qOptions');
  const qFeedback = document.getElementById('qFeedback');
  const qProgress = document.getElementById('quizProgress');
  const btnNext = document.getElementById('btnNextQuiz');
  const btnRestart = document.getElementById('btnRestartQuiz');

  btnNext.style.display = 'none';
  btnRestart.style.display = 'none';
  qFeedback.className = 'q-feedback hidden';
  qFeedback.innerHTML = '';

  qStep.textContent = `질문 ${idx + 1} / ${QUIZ_DATA.length}`;
  qTitle.textContent = qData.question;
  qProgress.style.width = `${((idx + 1) / QUIZ_DATA.length) * 100}%`;

  qOptions.innerHTML = '';

  qData.options.forEach((optText, optIdx) => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.textContent = `${optIdx + 1}. ${optText}`;
    btn.addEventListener('click', () => selectAnswer(btn, optIdx, qData));
    qOptions.appendChild(btn);
  });
}

function selectAnswer(selectedBtn, optIdx, qData) {
  const allBtns = document.querySelectorAll('.option-btn');
  const qFeedback = document.getElementById('qFeedback');
  const btnNext = document.getElementById('btnNextQuiz');

  allBtns.forEach(b => b.classList.add('disabled'));

  if (optIdx === qData.correctIndex) {
    selectedBtn.classList.add('correct');
    qFeedback.className = 'q-feedback correct';
    qFeedback.innerHTML = `<strong>🎉 정답입니다!</strong><br>${qData.explanation}`;
    userScore++;
  } else {
    selectedBtn.classList.add('wrong');
    allBtns[qData.correctIndex].classList.add('correct');
    qFeedback.className = 'q-feedback wrong';
    qFeedback.innerHTML = `<strong>아쉽지만 오답입니다.</strong><br>${qData.explanation}`;
  }

  qFeedback.classList.remove('hidden');
  btnNext.style.display = 'inline-flex';
}

function renderQuizResult() {
  const qStep = document.getElementById('qStep');
  const qTitle = document.getElementById('qTitle');
  const qOptions = document.getElementById('qOptions');
  const qFeedback = document.getElementById('qFeedback');
  const btnNext = document.getElementById('btnNextQuiz');
  const btnRestart = document.getElementById('btnRestartQuiz');

  btnNext.style.display = 'none';
  btnRestart.style.display = 'inline-flex';

  qStep.textContent = "퀴즈 완료!";
  qTitle.innerHTML = `🏆 총 ${QUIZ_DATA.length}문제 중 <strong>${userScore}문제</strong>를 맞히셨습니다!`;
  
  let scoreMsg = "";
  if (userScore === QUIZ_DATA.length) {
    scoreMsg = "완벽합니다! 과기정통부의 첨단 정책과 비전을 완벽히 이해하고 계시네요 👏";
  } else if (userScore >= 2) {
    scoreMsg = "훌륭합니다! 대한민국 미래 과학기술에 대한 관심이 매우 높으시군요!";
  } else {
    scoreMsg = "과기정통부의 흥미진진한 미래 정책들을 이번 기회에 가볍게 둘러보세요!";
  }

  qOptions.innerHTML = '';
  qFeedback.className = 'q-feedback correct';
  qFeedback.innerHTML = scoreMsg;
  qFeedback.classList.remove('hidden');
}

/* ----------------------------------------------------
   4. "나는 어떤 도움을 받을 수 있을까?" 맞춤 지원 찾기
   ---------------------------------------------------- */
const SUPPORT_DATABASE = [
  // 일반 국민 / 시니어
  {
    id: "cit-1",
    role: "citizen",
    tag: "디지털 역량",
    title: "전국민 무료 '디지털 배움터' 교육",
    desc: "스마트폰 기본 활용부터 키오스크 주문, 모바일 뱅킹, 인공지능(AI) 툴 활용법까지 주민센터 및 복지관에서 1:1 맞춤 무료 교육을 제공합니다.",
    agency: "한국지능정보사회진흥원(NIA) / 과기정통부",
    target: "전 국민 누구나 (어르신, 주부, 농어업인 등 환영)",
    benefit: "전액 무료 실습 교육, 전문 강사·서포터즈 1:1 지도",
    linkText: "디지털 배움터 공식 신청",
    url: "https://www.digitalbaeum.kr",
    interests: ["edu", "welfare"]
  },
  {
    id: "cit-2",
    role: "citizen",
    tag: "통신복지",
    title: "취약계층 및 어르신 통신요금 감면 지원",
    desc: "기초연금 수급자, 기초생활수급자, 차상위계층 및 장애인을 대상으로 이동통신 요금(월 최대 33,500원)을 감면해 가계 통신비 부담을 줄여드립니다.",
    agency: "과학기술정보통신부 / 통신 3사",
    target: "기초연금 수급 어르신, 기초생활수급자, 국가유공자 등",
    benefit: "기본료 및 통화료 월 11,000원 ~ 최대 33,500원 감면",
    linkText: "통신요금 감면제도 안내",
    url: "https://www.msit.go.kr",
    interests: ["cost", "welfare"]
  },
  {
    id: "cit-3",
    role: "citizen",
    tag: "디지털 보안",
    title: "보이스피싱·스미싱 악성앱 무료 탐지 및 '보호나라'",
    desc: "의심스러운 문자 링크(URL)를 카카오톡 채널로 전송하면 악성 여부를 10초 내 분석해 드리는 서비스와 사이버 침해 구제 지원을 제공합니다.",
    agency: "한국인터넷진흥원(KISA) / 과기정통부",
    target: "스미싱/보이스피싱 피해가 우려되는 모든 국민",
    benefit: "악성 앱 24시간 실시간 무료 점검 및 118 무료 상담",
    linkText: "KISA 보호나라 바로가기",
    url: "https://www.boho.or.kr",
    interests: ["security"]
  },

  // 학생 / 청년 / 취준생
  {
    id: "stu-1",
    role: "student",
    tag: "장학 지원",
    title: "이공계 우수학생 국가장학금 및 대학원 장려금",
    desc: "미래 과학기술 인재로 성장할 자연계열 및 공학계열 대학생, 대학원생을 대상으로 등록금 전액 및 연구 장려금을 국비로 지원합니다.",
    agency: "한국장학재단 / 과기정통부",
    target: "국내 4년제 대학 이공계열 우수 신입생 및 재학생",
    benefit: "정규학기 등록금 전액 지원 + 기초생활수급자 생활비 추가 지원",
    linkText: "한국장학재단 선발공고",
    url: "https://www.kosaf.go.kr",
    interests: ["scholarship", "career"]
  },
  {
    id: "stu-2",
    role: "student",
    tag: "취업 / 역량",
    title: "이노베이션 아카데미(42 Seoul) 및 SW마에스트로",
    desc: "자기주도형 문제해결 중심의 최정예 소프트웨어·AI 인재 양성 프로그램입니다. 학비 무료 및 최고급 멘토링, 개발 지원금을 제공합니다.",
    agency: "정보통신기획평가원(IITP) / 과기정통부",
    target: "만 18세 이상 SW·AI 개발자를 꿈꾸는 청년/취준생",
    benefit: "월 지원금(최대 100만 원 상당) 지급, 24시간 코딩 공간 및 멘토링",
    linkText: "SW마에스트로 지원센터",
    url: "https://www.swmaestro.org",
    interests: ["edu", "career"]
  },
  {
    id: "stu-3",
    role: "student",
    tag: "글로벌 연수",
    title: "AI·양자 미래 핵심인재 글로벌 연수 지원",
    desc: "미국 MIT, 스탠퍼드, 카네기멜론 등 세계 정상급 대학 및 연구소로 파견되어 최첨단 AI·양자컴퓨팅 기술을 현지에서 연구할 수 있도록 체재비를 지원합니다.",
    agency: "과기정통부 글로벌인재양성사업",
    target: "인공지능, 융합SW, 양자과학 전공 석·박사 과정생",
    benefit: "왕복 항공료, 현지 체재비, 파견기관 교육비 국비 전액 지원",
    linkText: "글로벌 연수사업 공고",
    url: "https://www.msit.go.kr",
    interests: ["career", "scholarship"]
  },

  // 연구자 / 교수
  {
    id: "res-1",
    role: "researcher",
    tag: "연구비 지원",
    title: "범부처 통합연구지원시스템 (IRIS) 기초연구사업",
    desc: "우수 신진연구자부터 중견, 리더 연구자까지 한 곳에서 연구계획서를 제출하고 평가받는 국가 R&D 원스톱 연구지원 프로그램입니다.",
    agency: "한국연구재단(NRF) / 과기정통부",
    target: "대학, 국공립 연구기관, 정부출연연 소속 연구원 및 교수",
    benefit: "과제당 연간 수천만 원 ~ 수십억 원 연구개발비 안정적 지원",
    linkText: "범부처 IRIS 포털 바로가기",
    url: "https://www.iris.go.kr",
    interests: ["grant", "facilities"]
  },
  {
    id: "res-2",
    role: "researcher",
    tag: "연구 인프라",
    title: "국가 대형 연구시설 및 양자·슈퍼컴퓨팅 공동활용",
    desc: "개별 연구실에서 구축하기 힘든 국가 슈퍼컴퓨터 5호기(누리온) 및 초전도 양자컴퓨터, 방사광가속기 등 거대 연구시설 이용을 무상·실비로 배정합니다.",
    agency: "한국과학기술정보연구원(KISTI) / 기초과학연구원",
    target: "빅데이터 계산, 바이오 신약, 천문우주, 양자물리 연구진",
    benefit: "세계 최정상급 연산 노드 및 실험 빔라인 배정",
    linkText: "KISTI 슈퍼컴퓨팅 센터",
    url: "https://www.kisti.re.kr",
    interests: ["facilities", "grant"]
  },

  // 기업인 / 스타트업 / 소상공인
  {
    id: "biz-1",
    role: "business",
    tag: "인프라 바우처",
    title: "고성능 AI 컴퓨팅 자원(GPU) 지원 사업",
    desc: "고비용의 초거대 AI 모델 개발에 필수적인 NVIDIA 고성능 가속기(H100/A100급) 클라우드 자원을 국내 AI 스타트업과 연구소에 무료 배정합니다.",
    agency: "정보통신산업진흥원(NIPA) / 과기정통부",
    target: "AI 솔루션 개발 중소기업, 스타트업, 대학 연구팀",
    benefit: "기업당 수천만 원 상당의 고성능 클라우드 GPU 크레딧 무상 제공",
    linkText: "NIPA 고성능 AI컴퓨팅 포털",
    url: "https://www.nipa.kr",
    interests: ["gpu", "subsidy"]
  },
  {
    id: "biz-2",
    role: "business",
    tag: "산업 전환",
    title: "전 산업 AI 대전환(AX) 바우처 지원 사업",
    desc: "제조, 유통, 의료 등 전통 기업이 현업에 AI 솔루션을 도입하여 공정을 혁신하고 생산성을 높일 수 있도록 최대 3억 원 상당의 도입 바우처를 지원합니다.",
    agency: "정보통신산업진흥원(NIPA) / 과기정통부",
    target: "AI를 자사 비즈니스에 도입하고자 하는 모든 중소·중견기업",
    benefit: "솔루션 도입비의 최대 80% 지원 (기업당 최대 3억 원)",
    linkText: "AI 바우처 지원사업 안내",
    url: "https://www.nipa.kr",
    interests: ["subsidy", "ai-trans"]
  },
  {
    id: "biz-3",
    role: "business",
    tag: "보안 점검",
    title: "중소기업·소상공인 무료 정보보호 안전진단 및 보안도구 배포",
    desc: "랜섬웨어와 해킹에 취약한 영세 기업을 위해 정보보안 전문가가 직접 방문하여 원격 점검 및 백신·암호화 백업 솔루션을 무료로 보급합니다.",
    agency: "한국인터넷진흥원(KISA) / 과기정통부",
    target: "보안 전담 인력이 부족한 중소기업 및 소상공인",
    benefit: "웹 취약점 무료 점검, 랜섬웨어 대응 백업 솔루션 100% 무상 설치",
    linkText: "KISA 보호나라 기업지원",
    url: "https://www.boho.or.kr",
    interests: ["security", "subsidy"]
  }
];

// 신분별 체크리스트 질문 옵션 매핑
const ROLE_CHECKLIST_OPTIONS = {
  citizen: [
    { value: "edu", strong: "디지털 기기 교육", p: "스마트폰, 무인 키오스크, 생성형 AI 기초 사용법이 궁금해요" },
    { value: "cost", strong: "통신비 절감", p: "가계 통신요금 감면 제도나 알뜰폰 할인 혜택을 알고 싶어요" },
    { value: "security", strong: "금융사기·스미싱 예방", p: "보이스피싱, 가짜 문자(URL), 해킹이 걱정돼요" },
    { value: "welfare", strong: "어르신·취약계층 복지", p: "기초연금 수급자나 장애인을 위한 디지털 복지가 필요해요" }
  ],
  student: [
    { value: "scholarship", strong: "장학금 / 학비 지원", p: "이공계 국가장학금이나 연구 장려금을 받고 싶어요" },
    { value: "career", strong: "개발자 취업 / 부트캠프", p: "SW마에스트로, 이노베이션 아카데미 등 무상 전문 코딩 교육" },
    { value: "edu", strong: "최신 AI·양자 기술 학습", p: "인공지능, 데이터사이언스, 양자물리 심화 과정을 배우고 싶어요" }
  ],
  researcher: [
    { value: "grant", strong: "국가 R&D 연구비 수주", p: "기초연구, 신진연구자 지원 및 범부처 IRIS 과제 공고를 찾아요" },
    { value: "facilities", strong: "첨단 슈퍼컴퓨터·장비 활용", p: "국가 슈퍼컴퓨터, 양자컴퓨터, 실험 인프라 이용권이 필요해요" }
  ],
  business: [
    { value: "gpu", strong: "GPU 연산 자원 확보", p: "초거대 AI 모델 개발에 필요한 고비용 가속기가 필요해요" },
    { value: "ai-trans", strong: "전통 산업의 AI 도입 (AX)", p: "제조, 물류, 서비스 현장에 AI 자동화를 적용하고 싶어요" },
    { value: "security", strong: "기업 보안 취약점 점검", p: "사내 데이터 유출 및 랜섬웨어 방어 점검이 시급해요" },
    { value: "subsidy", strong: "정부 지원금 및 바우처", p: "디지털 혁신 바우처 지원사업을 신청하고 싶어요" }
  ]
};

function initSupportFinder() {
  const roleInputs = document.querySelectorAll('input[name="userRole"]');
  const roleCards = document.querySelectorAll('.identity-card');
  const btnFind = document.getElementById('btnFindSupport');
  const btnReset = document.getElementById('btnResetSupport');

  // 신분 변경 시 체크리스트 동적 갱신
  roleInputs.forEach(input => {
    input.addEventListener('change', () => {
      roleCards.forEach(c => c.classList.remove('active'));
      input.closest('.identity-card').classList.add('active');
      renderChecklistOptions(input.value);
    });
  });

  // 초기 렌더링 (citizen 기본)
  renderChecklistOptions("citizen");

  // 진단 버튼 클릭
  if (btnFind) {
    btnFind.addEventListener('click', calculateAndShowResults);
  }

  // 초기화 버튼 클릭
  if (btnReset) {
    btnReset.addEventListener('click', () => {
      document.querySelector('input[name="userRole"][value="citizen"]').checked = true;
      roleCards.forEach(c => c.classList.remove('active'));
      document.querySelector('.identity-card').classList.add('active');
      renderChecklistOptions("citizen");
      const resultArea = document.getElementById('finderResultArea');
      resultArea.style.display = 'none';
    });
  }
}

function renderChecklistOptions(role) {
  const container = document.getElementById('interestTagsContainer');
  if (!container) return;

  const options = ROLE_CHECKLIST_OPTIONS[role] || [];
  container.innerHTML = '';

  options.forEach((opt, idx) => {
    const label = document.createElement('label');
    label.className = 'interest-item';
    label.innerHTML = `
      <input type="checkbox" name="interestTag" value="${opt.value}" ${idx === 0 ? 'checked' : ''}>
      <div class="item-info">
        <strong>${opt.strong}</strong>
        <p>${opt.p}</p>
      </div>
    `;

    // 체크 스타일 토글
    const chk = label.querySelector('input[type="checkbox"]');
    if (chk.checked) label.classList.add('checked');

    chk.addEventListener('change', () => {
      if (chk.checked) label.classList.add('checked');
      else label.classList.remove('checked');
    });

    container.appendChild(label);
  });
}

function calculateAndShowResults() {
  const currentRole = document.querySelector('input[name="userRole"]:checked')?.value || "citizen";
  const checkedBoxes = document.querySelectorAll('input[name="interestTag"]:checked');
  const selectedInterests = Array.from(checkedBoxes).map(cb => cb.value);

  // DB 필터링: 신분 매칭 + 관심사 매칭
  const matchedList = SUPPORT_DATABASE.filter(item => {
    if (item.role !== currentRole) return false;
    if (selectedInterests.length === 0) return true; // 아무것도 체크 안했으면 신분 전체
    return item.interests.some(tag => selectedInterests.includes(tag));
  });

  const resultArea = document.getElementById('finderResultArea');
  const cardsContainer = document.getElementById('resultCardsContainer');
  const countEl = document.getElementById('resultCount');

  cardsContainer.innerHTML = '';
  countEl.textContent = matchedList.length;

  if (matchedList.length === 0) {
    cardsContainer.innerHTML = `
      <div style="grid-column: 1 / -1; padding: 40px; text-align: center; color: var(--text-muted);">
        선택하신 조건에 해당하는 세부 지원사업이 없습니다. 다른 관심사를 체크해보시거나 과기정통부 대표포털(110)로 문의해주세요.
      </div>
    `;
  } else {
    matchedList.forEach(item => {
      const card = document.createElement('div');
      card.className = 'benefit-card';
      card.innerHTML = `
        <div class="benefit-top">
          <span class="benefit-tag">${item.tag}</span>
          <span class="benefit-agency">${item.agency}</span>
        </div>
        <h4 class="benefit-title">${item.title}</h4>
        <p class="benefit-desc">${item.desc}</p>
        <div class="benefit-specs">
          <div><strong>지원 대상 :</strong> ${item.target}</div>
          <div><strong>제공 혜택 :</strong> ${item.benefit}</div>
        </div>
        <a href="${item.url}" target="_blank" rel="noopener noreferrer" class="benefit-btn">
          <span>${item.linkText}</span>
          <i data-lucide="external-link"></i>
        </a>
      `;
      cardsContainer.appendChild(card);
    });
  }

  resultArea.style.display = 'flex';
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // 부드럽게 결과창으로 스크롤 이동
  resultArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
