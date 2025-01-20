//사업단 공지 보여주는 함수
async function displayData() {
  const aiBox = document.getElementById('ai_box');
  const recommendButton = document.getElementById('like_btn'); // 추천 버튼 찾기

  //추천 버튼 아래 컨테이너를 추가
  const container = document.createElement('div');
  container.style.display = 'flex';
  container.style.flexWrap = 'wrap';
  container.style.gap = '20px';
  container.style.padding = '0px';
  container.style.flexDirection = 'column';

  aiBox.appendChild(container); // aiBox 아래에 추가하기

  try {
    const data = await getData(); // 데이터 가져오기
    if (data.status == 401) {
      alert(`${response.message}`);
      window.location, (href = 'login.html');
      return;
    }
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

document.addEventListener('DOMContentLoaded', function () {
  displayData();
});
//

//데이터를 가져오는 함수

/*
async function getData() {
  try {
    const response = await fetch(config.serverURL+'recommendation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('데이터 가져오기 실패:', error);
  }
}
  */

async function getData() {
  // 하드코딩 JSON 데이터 -> 백엔드 끝나면 수정
  return {
    response: [
      {
        business_group_name: 'notice_haksa',
        business_group_id: '1',
        alarm: [
          {
            title:
              '[학사안내][채용공고] 전남대학교 사범대학 가정교육과 교육공무원(조교) 공개 채용 공고',
            url: 'https://www.jnu.ac.kr/WebApp/web/HOM/COM/Board/board.aspx?boardID=5&bbsMode=view&page=1&key=64820&cate=5',
          },
        ],
      },
      {
        business_group_name: 'notice_daehak',
        business_group_id: '2',
        alarm: [
          {
            title:
              '[학사안내]2025학년도 1학기 타 대학교(동국대 일반대학원) 교류학생 신청 안내',
            url: 'https://www.jnu.ac.kr/WebApp/web/HOM/COM/Board/board.aspx?boardID=5&bbsMode=view&page=1&key=64814&cate=5',
          },
        ],
      },
      {
        business_group_name: 'notice_janghak',
        business_group_id: '3',
        alarm: [
          {
            title: '[장학안내]2025년도 1학기 한국여성의정 장학생 모집 안내',
            url: 'https://www.jnu.ac.kr/WebApp/web/HOM/COM/Board/board.aspx?boardID=5&bbsMode=view&page=1&key=64799&cate=8',
          },
        ],
      },
      {
        business_group_name: 'sojoong',
        business_group_id: '2',
        alarm: [
          {
            title:
              '[행사안내] 2024 공동 SW산업세미나 신청 안내(4회차 신청기간: ~11.19.까지)',
            url: 'https://www.sojoong.kr/www/notice/view/646',
          },
        ],
      },
    ],
  };
}

//

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

      const response = await fetch('백엔드주소', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sendtag),
      });

      const result = await response.json();

      if (response.ok) {
        console.log('태그 정보 보내기 성공');
      } else {
        throw error('태그 정보 보내기 실패');
      }
    } catch (error) {
      console.log('데이터 오류', error);
      alert('오류가 발생하였습니다.');
    }
  });
//
