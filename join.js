import { config } from './config.js';

// 회원가입
async function join(accountId, password) {
  try {
    const response = await fetch(config.serverURL + 'users/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accountId, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error('회원가입 실패함');
    }

    alert(`${data.message}`);
  } catch (error) {
    alert('오류가 발생하였습니다');
    console.log('서버 오류', error);
  }
}

//가입하기 버튼
const joinbtn = document.getElementById('join_btn');
joinbtn.addEventListener('click', async function () {
  const accountId = document.getElementById('accountId').value;
  const password = document.getElementById('password').value;
  const password_confirm = document.getElementById('password_confirm').value;

  //비밀번호 확인

  if (!password || !password_confirm) {
    alert('비밀번호를 입력해주세요.');
    return;
  }

  const isAvailable = await id_confirm();

  if (isAvailable == true) {
    if (password !== password_confirm) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    } else {
      await join(accountId, password);
      window.location.href = 'login.html';
    }
  } else {
    return;
  }
});

//아이디 중복 확인
async function id_confirm() {
  const accountId = document.getElementById('accountId').value.trim();

  if (!accountId) {
    alert('아이디를 입력해주세요.');
    return false; //함수 종료
  }

  try {
    const response = await fetch(
      config.serverURL +
        `users/id-check?accountId=${encodeURIComponent(accountId)}`,
      {
        method: 'GET',
      }
    );
    const data = await response.json();

    if (data.success == true) {
      alert(`${data.message}`);
      return true;
    } else {
      alert(`${data.message}`);
      return false;
    }
  } catch (error) {
    console.log('서버 오류', error);
    return false;
  }
}

// 중복 확인 버튼
document.addEventListener('DOMContentLoaded', () => {
  const checkbtn = document.getElementById('checkbtn');
  checkbtn.addEventListener('click', id_confirm);
});
