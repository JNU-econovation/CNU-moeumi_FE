import { config } from './config.js';

let login = false;
let logoutt = false;

async function getcookie() {
  try {
    const response = await fetch(config.serverURL + 'iscookie', {
      method: 'GET',
      credentials: 'include',
    });

    console.log(`${cookiedata}`);

    if (response.status == 401) {
      login = false;
      return login;
    }

    if (response.ok) {
      login = true;
      return login;
    }
  } catch (error) {
    console.error('getcookie 오류 :', error);
    return login;
  }
}

async function getData() {
  try {
    const response = await fetch(config.serverURL + 'alarm', {
      method: 'GET',
      credentials: 'include',
    });

    const data = await response.json();

    return { data, response };
  } catch (error) {
    console.error('getData 오류 :', error);
    return { data, response };
  }
}

async function displayData() {
  const container = document.createElement('div');
  container.style.display = 'flex';
  container.style.flexWrap =
    'wrap'; /*자식 요소들이 컨테이너를 벗어날 때 다음 줄로 자동으로 넘겨줌*/
  container.style.width = '1570px';
  container.style.padding = '0px';
  container.style.gap = '20px';
  container.style.margin = '25px auto';
  document.body.appendChild(container);

  try {
    const { data, response } = await getData();
    const login = await getcookie();

    if (!data) {
      alert('데이터를 불러오는 데 실패했습니다.');
      console.log('getData 오류');
      return;
    }

    data.response.forEach((group) => {
      /*foreach는 배열을 순회하는 매서드, 반복문이지만 값을 반환하지 않는 것이 특징! */
      const box = document.createElement('div');
      box.style.backgroundColor = 'white';
      box.style.width = '450px';
      box.style.margin = '20px';
      box.style.borderRadius = '10px';
      box.style.padding = '10px';
      box.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.1)';
      box.style.display = 'flex';
      box.style.flexDirection = 'column';

      const groupTitle = document.createElement('h3');
      if (group.businessGroupName == 'sojoong') {
        groupTitle.textContent = '소프트웨어중심대학사업단';
      } else if (group.businessGroupName == 'inhyuck') {
        groupTitle.textContent = '인공지능혁신융합대학사업단';
      } else if (group.businessGroupName == 'chahyuck') {
        groupTitle.textContent = '차세대통신혁신융합대학사업단';
      } else if (group.businessGroupName == 'EAI') {
        groupTitle.textContent = 'EnergyAI핵심인재양선교육연구단';
      } else if (group.businessGroupName == 'potal') {
        groupTitle.textContent = '포털공지사항';
      } else if (group.businessGroupName == 'haksa') {
        groupTitle.textContent = '학사안내';
      } else if (group.businessGroupName == 'janghack') {
        groupTitle.textContent = '장학안내';
      } else if (group.businessGroupName == 'chjin') {
        groupTitle.textContent = '취업정보';
      } else {
        groupTitle.textContent = 'null';
      }
      groupTitle.style.borderBottom = '1.3px solid lightgrey';
      groupTitle.style.padding = '10px 0';
      groupTitle.style.marginBottom = '15px';
      box.appendChild(groupTitle);

      const alarmList = document.createElement('ul');
      alarmList.style.listStyleType = 'none';
      alarmList.style.padding = '0';
      alarmList.style.margin = '0';
      alarmList.style.flex = '1'; /*남은 공간 같게 만들기 */

      group.alarm.forEach((alarm) => {
        const [datePart, timepart] = alarm.timestamp.split(' ');
        const [year, month, day] = datePart.split('-');

        //날짜 전체 테두리 같은거 + 알람 테두리
        const alarmItem = document.createElement('li');
        alarmItem.style.display = 'flex';
        alarmItem.style.justifyContent = 'space-between';
        alarmItem.style.alignItems = 'center';
        alarmItem.style.marginBottom = '10px';
        alarmItem.style.borderBottom = '1px solid lightgrey'; // 타이틀 아래 줄
        alarmItem.style.paddingBottom = '10px';

        //날짜 컨테이너
        const dateContainer = document.createElement('div');
        dateContainer.style.textAlign = 'center';
        dateContainer.style.marginRight = '15px';

        //일 컨테이너
        const dayElement = document.createElement('div');
        dayElement.textContent = day;
        dayElement.style.fontSize = '18px';
        dayElement.style.fontWeight = 'bold';

        //연-월 컨테이너
        const yearMonthElement = document.createElement('div');
        yearMonthElement.textContent = `${year}.${month}`;
        yearMonthElement.style.fontSize = '12px';
        yearMonthElement.style.color = '#666';

        dateContainer.appendChild(dayElement);
        dateContainer.appendChild(yearMonthElement);

        // 알람 타이틀
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
          if (groupTitle.textContent == '소프트웨어중심대학사업단') {
            window.open(config.s + alarm.url, '_blank');
          } else if (groupTitle.textContent == '인공지능혁신융합대학사업단') {
            window.open(config.i + alarm.url, '_blank');
          } else if (groupTitle.textContent == '차세대통신혁신융합대학사업단') {
            window.open(config.c + alarm.url, '_blank');
          } else if (
            groupTitle.textContent == 'EnergyAI핵심인재양선교육연구단'
          ) {
            window.open(config.e + alarm.url, '_blank');
          } else {
            window.open(config.cnu + alarm.url, '_blank');
          }
        });

        if (response.status == 401) {
          //로그아웃 - 쿠키 비정상
          if (!logoutt) {
            logoutt = true;
            alert(`${data.message}`);
            window.location.reload(); // 페이지 새로고침
            return;
          }
        } else if (response.ok && !login) {
          //로그아웃 + 쿠키 없음
          alarmItem.appendChild(dateContainer);
          alarmItem.appendChild(titleElement);
          alarmList.appendChild(alarmItem);
        } else if (response.ok && login) {
          const heartButton = document.createElement('div');
          heartButton.innerHTML = config.heart;
          heartButton.style.color = 'grey';
          heartButton.style.cursor = 'pointer';
          heartButton.style.marginLeft = '10px';

          const like = alarm.like;
          heartButton
            .querySelector('path')
            .setAttribute('fill', like == 1 ? 'red' : 'none');

          heartButton.addEventListener('click', async function () {
            try {
              const newlike = like === 1 ? 0 : 1;

              const response = await fetch(config.serverURL + 'bookmarks/', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  businessGroupId: group.businessGroupId,
                  alarm_id: alarm.alarm_id,
                  like: newlike,
                }),
              });

              const result = await response.json();
              if (response.ok) {
                let path = heartButton.querySelector('path');
                let currentFill = path.getAttribute('fill');
                path.setAttribute(
                  'fill',
                  currentFill === 'red' ? 'none' : 'red'
                );
                alert(`${result.message}`);
              } else {
                alert('북마크 등록에 실패했습니다.');
              }
            } catch (error) {
              console.error('서버 오류:', error);
            }
          });

          alarmItem.appendChild(dateContainer);
          alarmItem.appendChild(titleElement);
          alarmItem.appendChild(heartButton);
          alarmList.appendChild(alarmItem);
        } else {
          alarmItem.appendChild(dateContainer);
          alarmItem.appendChild(titleElement);
          alarmList.appendChild(alarmItem);
          alert(
            '데이터를 불러오는 중 오류가 발생하였습니다. 잠시후 다시 시도해주세요'
          );
        }
      });

      box.appendChild(alarmList);

      // 더보기 버튼!
      const moreButton = document.createElement('div');
      moreButton.textContent = '더보기';
      moreButton.style.textAlign = 'center';
      moreButton.style.color = 'black';
      moreButton.style.fontWeight = 'bold';
      moreButton.style.fontSize = '20px';
      moreButton.style.cursor = 'pointer';
      moreButton.style.padding = '5px 0';
      moreButton.addEventListener('click', () => {
        if (groupTitle.textContent == '소프트웨어중심대학사업단') {
          window.open(config.sojoong, '_blank');
        } else if (groupTitle.textContent == '인공지능혁신융합대학사업단') {
          window.open(config.inhyuck, '_blank');
        } else if (groupTitle.textContent == '차세대통신혁신융합대학사업단') {
          window.open(config.chahyuck, '_blank');
        } else if (groupTitle.textContent == 'EnergyAI핵심인재양선교육연구단') {
          window.open(config.EAI, '_blank');
        } else if (groupTitle.textContent == '포털공지사항') {
          window.open(config.potal, '_blank');
        } else if (groupTitle.textContent == '학사안내') {
          window.open(config.haksa, '_blank');
        } else if (groupTitle.textContent == '장학안내') {
          window.open(config.janghack, '_blank');
        } else if (groupTitle.textContent == '취업정보') {
          window.open(config.chjin, '_blank');
        } else {
          alert('지원하지 않습니다');
        }
      });

      box.appendChild(moreButton);
      container.appendChild(box);
    });
  } catch (error) {
    console.error('displayData 오류:', error);
  }
}

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

    const data = await response.json();

    if (!response.ok || data.success !== 'true') {
      console.error('로그아웃 실패');
      throw new Error('로그아웃 실패');
    }

    login = false;
    changeUI();
    alert(`${data.message}`);
    window.location.href = 'main.html';
  } catch (error) {
    alert('오류가 발생했습니다.');
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

document.addEventListener('DOMContentLoaded', async function () {
  await displayData();
});
