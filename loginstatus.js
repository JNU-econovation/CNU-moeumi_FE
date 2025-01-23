import { config } from './config.js';

//로그인버튼 로그아웃버튼으로 바뀌는 함수
function changeUI() {
  const loginBtn = document.getElementById('head_log');

  if (!login) {
    loginBtn.textContent = '로그인';
    loginBtn.onclick = () => (window.location.href = 'login.html'); //화살표함수
  } else {
    loginBtn.textContent = '로그아웃';
    loginBtn.onclick = logout;
  }
}

//로그아웃함수(로그인페이지 제외)
async function logout() {
  if (!login) {
    window.location.href = 'login.html';
    return;
  }

  try {
    const response = await fetch(config.serverURL + 'users/logout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });

    if (!response.ok) {
      console.error('로그아웃 실패');
      throw new Error('로그아웃 실패');
    }

    login = false;
    changeUI();
    alert('로그아웃 되었습니다');
    window.location.href = 'main.html';
  } catch (error) {
    console.log('오류가 발생했습니다.', error);
  }
}

//코드 실행
const loginBtn = document.getElementById('head_log');
loginBtn.addEventListener('click', async function () {
  if (login) {
    await logout();
  } else {
    window.location.href = 'login.html';
  }
});
