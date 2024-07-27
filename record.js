document.addEventListener('DOMContentLoaded', function () {
    // 버튼과 입력 박스 참조
    const recordButton = document.getElementById('record-btn');
    const sendButton = document.getElementById('send-btn');
    const urlInput = document.getElementById('url-input');

    // 버튼 클릭 이벤트 리스너
    recordButton.addEventListener('click', function () {
        // 입력 박스의 값 가져오기
        let url = urlInput.value.trim();

        // URL이 빈 문자열이 아닌지 확인
        if (url !== '') {
            // URL이 'http://' 또는 'https://'로 시작하지 않는 경우
            if (!/^https?:\/\//i.test(url)) {
                url = 'https://' + url; // 기본적으로 'https://' 붙이기
            }
            chrome.runtime.sendMessage({ action: "openNewWindow", url: url });
        } else {
            alert('Please enter a valid URL.');
        }
    });
    sendButton.addEventListener('click', ()=>{
        const test_cases=document.querySelectorAll('table tbody tr');
        const table_data=Array.from(test_cases).map((test_case)=>{;
            return{
                id: test_case.querySelector('th').textContent,
                role: test_case.querySelector('td').textContent,
                xpath: test_case.querySelector('#xpath').textContent,
                input: test_case.querySelector('#input').textContent,
                output: test_case.querySelector('#output').textContent
            }
    });
    // sendDataToDB(table_data);
    console.log(table_data);
    });
    // 입력 박스에서 Enter 키 눌렀을 때
    urlInput.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            event.preventDefault(); // 기본 Enter 동작 방지
            recordButton.click(); // 버튼 클릭 이벤트 트리거
        }
    });
});

// 전달된 메시지를 수신합니다 from content script.
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.action === "updateXPath") {
        let test_case=message.test_case;
        addRowToTable(test_case.id, test_case.xpath, test_case.role, test_case.input, test_case.output);
    }
});
function sendDataToServer(data) {
    fetch('https://cbnutester.site/record/', {  // 서버의 실제 URL로 변경하세요
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        console.log('Success:', result);
        alert('Data successfully sent to the server!');
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to send data to the server.');
    });
}

// 테이블에 새로운 행을 추가하는 함수
function addRowToTable(id, xpath, role, input, output) {
    const tableBody = document.querySelector('table tbody');

    // 새 행 생성
    const newRow = document.createElement('tr');

    // 각 셀 생성
    const idCell = document.createElement('th');
    idCell.scope = 'row';
    idCell.textContent = id;

    const roleCell = document.createElement('td');
    roleCell.textContent = role;

    const xpathCell = document.createElement('td');
    xpathCell.className = 'column';
    xpathCell.innerHTML = `<div class="column-content" id="xpath">${xpath}</div>`;

    const inputCell = document.createElement('td');
    inputCell.className = 'column';
    inputCell.innerHTML = `<div class="column-content" id="input">${input}</div>`;

    const outputCell = document.createElement('td');
    outputCell.className = 'column';
    outputCell.innerHTML = `<div class="column-content" id="output">${output}</div>`;

    const actionCell = document.createElement('td');
    actionCell.className = 'text-center-action';
    actionCell.innerHTML = `
        <button class="btn btn-success btn-spacing" id="mod-btn">MODIFY</button>
        <button class="btn btn-danger" id="del-btn">DELETE</button>
    `;

    // 새 행에 셀 추가
    newRow.appendChild(idCell);
    newRow.appendChild(roleCell);
    newRow.appendChild(xpathCell);
    newRow.appendChild(inputCell);
    newRow.appendChild(outputCell);
    newRow.appendChild(actionCell);

    // 테이블에 새 행 추가
    tableBody.appendChild(newRow);
}
