import { config } from './config.js';

let login = false;

//사업단 공지 보여주는 함수
async function displayData() {
  const aiBox = document.getElementById('ai_box');
  const recommendButton = document.getElementById('like_btn');

  //추천 버튼 아래 컨테이너를 추가
  const container = document.createElement('div');
  container.style.display = 'flex';
  container.style.flexWrap = 'wrap';
  container.style.gap = '20px';
  container.style.padding = '0px';
  container.style.flexDirection = 'column';

  aiBox.appendChild(container); // aiBox 아래에 추가하기

  try {
    const { data, response } = await getData(); // 데이터 가져오기
    if (response.status == 401) {
      alert(`${data.message}`);
      window.location.href = 'login.html';
      return;
    }

    if (response.ok) {
      login = true;
    }

    changeUI();

    const Title = document.createElement('h4');
    Title.textContent = '♥️ 추천 공지사항';
    Title.style.paddingBottom = '20px';
    Title.style.borderBottom = '1.5px solid lightgrey';

    container.appendChild(Title);

    data.response.forEach((group) => {
      const alarmList = document.createElement('ul');
      alarmList.style.listStyleType = 'none';
      alarmList.style.padding = '0';
      alarmList.style.margin = '0';
      alarmList.style.flex = '1';

      group.alarm.forEach((alarm) => {
        const alarmItem = document.createElement('li');
        alarmItem.style.paddingBottom = '20px';
        alarmItem.style.borderBottom = '1.5px solid lightgrey';

        const titleElement = document.createElement('span');
        titleElement.textContent = alarm.title;
        titleElement.style.flex = '1';
        titleElement.style.whiteSpace = 'nowrap';
        titleElement.style.overflow = 'hidden';
        titleElement.style.textOverflow = 'ellipsis';
        titleElement.style.cursor = 'pointer';
        titleElement.addEventListener('mouseover', () => {
          titleElement.style.textDecoration = 'underline';
        });
        titleElement.addEventListener('mouseout', () => {
          titleElement.style.textDecoration = 'none';
        });
        titleElement.addEventListener('click', () => {
          window.open(alarm.url, '_blank'); // URL 새 창 열기
        });

        alarmItem.appendChild(titleElement);
        alarmList.appendChild(alarmItem);
      });
      container.appendChild(alarmList);
    });
  } catch (error) {
    console.error('데이터를 표시하는 중 오류 발생:', error);
  }
}

//데이터를 가져오는 함수

async function getData() {
  try {
    const response = await fetch(config.serverURL + 'recommendation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    const data = await response.json();
    return { data, response };
  } catch (error) {
    console.error('데이터 가져오기 실패:', error);
  }
}

//태그 누르면 태그 색 바뀜 + 회색 창에 들어감
const tagStatus = { tag: [] };

const tags = ['공학', '보건', '정치', '경제', '언론', '창업', '봉사', '환경'];

tags.forEach((tag) => {
  const tagbtn = document.getElementById(tag);
  tagbtn.addEventListener('click', function () {
    const btn_bar = document.getElementById('btn_bar');
    if (tagbtn.style.background === 'darkgrey') {
      tagbtn.style.background = 'none';
      const remove_copiedButton = document.getElementById(`bar-${tag}`);
      if (remove_copiedButton) {
        btn_bar.removeChild(remove_copiedButton); //tagStatus에서 삭제
      }
      tagStatus.tag = tagStatus.tag.filter((item) => item !== tag);
    } else {
      tagbtn.style.background = 'darkgrey';

      const copiedButton = tagbtn.cloneNode(true); //html요소 복제할때 사용(true는 자식요소 포함임)
      copiedButton.id = `bar-${tag}`;
      btn_bar.appendChild(copiedButton);

      tagStatus.tag.push(tag); //tagStatus에 추가
    }
  });
});
//

//태그 뭐 눌렀는지 보내기
document
  .getElementById('like_btn')
  .addEventListener('click', async function () {
    try {
      const sendtag = { tag: tagStatus.tag };
      console.log(sendtag);

      const response = await fetch(config.serverURL + 'recommendation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sendtag),
      });

      const result = await response.json();

      if (response.ok) {
        console.log('태그 정보 보내기 성공');
        await displayData();
      } else {
        throw error('태그 정보 보내기 실패');
      }
    } catch (error) {
      console.log('데이터 오류', error);
      alert('오류가 발생하였습니다.');
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
