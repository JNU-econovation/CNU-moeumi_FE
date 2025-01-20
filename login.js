import { config } from './config.js';

// 로그인요청
async function login(accountId, password) {
  if (!accountId) {
    alert('아이디를 입력해주세요.');
    return;
  }

  if (!password) {
    alert('비밀번호를 입력해주세요.');
    return;
  }

  try {
    const response = await fetch(config.serverURL + 'users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accountId, password }),
      credentials: 'include', //이걸 추가하면 자동으로 세션쿠키가 전송됨!
    });

    const data = await response.json();

    if (!response.ok) {
      alert(`${data.message}`);
      throw new Error('로그인 실패함');
    }

    alert(`반갑습니다, ${accountId} 님`);
    window.location.href = 'main.html';
  } catch (error) {
    console.log('서버 오류', error);
  }
}

//로그인버튼(로그인페이지에 있는버튼)누르면 로그인요청함수가 실행됨
const loginbtn = document.getElementById('btn');
loginbtn.addEventListener('click', function (event) {
  event.preventDefault(); //폼제출보다 로그인 요청함수가 실행되도록
  const accountId = document.getElementById('accountId').value;
  const password = document.getElementById('password').value;
  login(accountId, password);
});
