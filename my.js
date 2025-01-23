import { config } from './config.js';

let login = false;

//즐겨찾기 뭐했는지 조회함수
async function getData() {
  try {
    const response = await fetch(config.serverURL + 'mypage', {
      method: 'GET',
      credentials: 'include',
    });

    const likeData = await response.json();

    if (response.status == 401) {
      alert(`${likeData.message}`);
      window.location.href = 'login.html';
      return;
    }

    if (response.ok) {
      login = true;
    }

    const businessGroupMap = {
      sojoong: 'sojoong',
      inhyuck: 'inhyuck',
      chahyuck: 'chahyuck',
      EAI: 'EAI',
      potal: 'potal',
      haksa: 'haksa',
      janghack: 'janghack',
      chjin: 'chjin',
    };

    console.log(likeData); // 삭제!!!

    const userId = likeData.accountId;
    const usernameDiv = document.querySelector('.username_div');
    usernameDiv.innerHTML = `<span style="font-weight: bold;">${userId}</span> 님의 즐겨찾기`;

    likeData.message.forEach((item) => {
      const starId = businessGroupMap[item.businessGroupName];
      if (starId) {
        const star = document.getElementById(starId);
        if (star) {
          const liked = item.liked;
          const path = star.querySelector('path');
          path.setAttribute('fill', liked ? 'yellow' : 'none');

          favoriteStatus[starId] = liked ? 1 : 0;
        } else {
          console.log(`${starId} 찾을 수 없음`);
        }
      }
    });
  } catch (error) {
    console.log('데이터 오류');
  }
}

document.addEventListener('DOMContentLoaded', async function () {
  await getData();
  changeUI();
});

//

//별 눌렀을때 ui 변경, 데이터 수정
const favoriteStatus = {};

const starIds = [
  'sojoong',
  'inhyuck',
  'chahyuck',
  'EAI',
  'potal',
  'haksa',
  'janghack',
  'chjin',
];

starIds.forEach((starId) => {
  const star = document.getElementById(starId);
  if (star) {
    star.addEventListener('click', function () {
      let path = this.querySelector('path');
      let currentFill = path.getAttribute('fill');
      let newFill = currentFill === 'yellow' ? 'none' : 'yellow';
      path.setAttribute('fill', newFill);

      favoriteStatus[starId] = newFill === 'yellow' ? 1 : 0;
    });
  } else {
    console.log(`ID가 '${starId}'인 요소를 찾을 수 없습니다.`);
  }
});

//저장하기 버튼 눌렀을 때 즐겨찾기 수정 보내기
document
  .getElementById('save_btn')
  .addEventListener('click', async function () {
    try {
      // 서버 형식
      const favoriteList = Object.keys(favoriteStatus).map((key) => ({
        businessGroupName: key,
        liked: favoriteStatus[key],
      }));

      const request = {
        message: favoriteList,
      };

      const response = await fetch(config.serverURL + 'mypage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      const result = await response.json();

      if (response.ok) {
        alert('즐겨찾기가 저장되었습니다.');
        console.log(result);
        window.location.reload;
      } else {
        alert(`저장 실패: ${result.message}`);
      }
    } catch (error) {
      console.error('저장 중 오류 발생:', error);
      alert('저장 중 오류가 발생하였습니다.');
    }
  });
//

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
