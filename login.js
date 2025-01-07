// 로그인요청
async function login(account_id, pw) {
  try {
    const response = await fetch('http://백엔드주소/user/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ account_id, pw }),
      credentials: 'include', //이걸 추가하면 자동으로 세션쿠기가 전송됨
    });

    if (!response.ok) {
      throw new Error('로그인 실패함');
    }
    window.location.href = 'main.html';
  } catch (error) {
    alert('로그인 에러');
  }
}

//로그인버튼(로그인페이지에 있는버튼)누르면 로그인요청함수가 실행됨
const loginbtn = document.getElementById('btn');
loginbtn.addEventListener('click', function (event) {
  event.preventDefault(); //폼제출보다 로그인 요청함수가 실행되도록
  const account_id = document.getElementById('id').value;
  const pw = document.getElementById('password').value;
  login(account_id, pw);
});
