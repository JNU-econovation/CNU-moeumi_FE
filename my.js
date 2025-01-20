import { config } from './config.js';

let login = false;

//즐겨찾기 뭐했는지 조회함수
async function getData() {
  try {
    const response = await fetch(config.serverURL + 'mypage', {
      method: 'GET',
      credentials: 'include',
    });
    if (response.status == 401) {
      alert(`${response.message}`);
      window.location.href = 'login.html';
      return;
    }
    const likeData = await response.json();

    const businessGroupMap = {
      소프트웨어중심대학사업단: 'sojoong',
      인공지능혁신융합대학사업단: 'inhyuck',
      차세대통신혁신융합대학사업단: 'chahyuck',
      EnergyAI핵심인재양선교육연구단: 'EAI',
      전남대포털공지사항: 'potal',
      학사안내: 'haksa',
      장학안내: 'janghack',
      취업진로공지: 'chjin', //중요--> 서버랑 이름 맞추기!!!!!!
    };

    console.log(likeData); // 삭제제

    likeData.message.forEach((item) => {
      const starId = businessGroupMap[item.business_group_name];
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

document.addEventListener('DOMContentLoaded', function () {
  getData();
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
        business_group_name: key,
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

//로그아웃함수(로그인페이지 제외) 프론트에서 뭔가 처리를 안하는게 맞지 않나, 어카운트아이디 바디에서 없애는 방향 바디가 없으면 post 댜신 다른 매서드 고민
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

    const data = await response.json();

    if (!response.ok || data.success !== 'true') {
      console.log('로그아웃 실패');
      throw new Error('로그아웃 실패');
    }

    changeUI();
    alert(`${data.message}`);
    window.location.href = 'main.html';
  } catch (error) {
    alert('오류가 발생했습니다.');
  }
}

//코드 실행

/*const loginBtn = document.getElementById('head_log');
loginBtn.addEventListener('click', async function () {
  await logout();
});
*/
