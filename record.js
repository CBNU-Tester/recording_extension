import { sendDataToServer, addRowToTable } from './record_utils.js';
document.addEventListener('DOMContentLoaded', function () {
    // 버튼과 입력 박스 참조
    const recordButton = document.getElementById('record-btn');
    const sendButton = document.getElementById('send-btn');
    const urlInput = document.getElementById('url-input');
    const clearButton = document.getElementById('clear-btn');
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

    clearButton.addEventListener('click', function () {
        const tableBody = document.querySelector('table tbody');
        tableBody.innerHTML = '';
    });
    

    // 전송 버튼 클릭 이벤트 리스너
    sendButton.addEventListener('click', ()=>{
        const web_url=document.getElementById('url-input').value;
        const test_title=document.getElementById('test-title').value;
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
    console.log(table_data);
    const dataToSend={
        url: web_url,
        title: test_title,
        test_cases: table_data
    }
    sendDataToServer(dataToSend);
    });
    // 입력 박스에서 Enter 키 눌렀을 때
    urlInput.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            event.preventDefault(); // 기본 Enter 동작 방지
            recordButton.click(); // 버튼 클릭 이벤트 트리거
            clearButton.click();
        }
    });
});

// 전달된 메시지를 수신합니다 from content script.
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.action === "updateXPath") {
        let test_case=message.test_case;
        addRowToTable(test_case.id, test_case.xpath, test_case.role, test_case.input, test_case.output);
    }
    
    if (message.action==="updateInput"){
        let test_case=message.test_case;
        addRowToTable(test_case.id, test_case.xpath, test_case.role, test_case.input, test_case.output);
    }
    
    if (message.action==="updateURL"){
        let test_case=message.test_case;
        const xpath=urlGetXpath();
        addRowToTable(test_case.id, xpath, test_case.role, test_case.input, test_case.output);
    }
});

function urlGetXpath() {
    const tableBody = document.querySelector('table tbody');
    let xpathValue = null; // 함수 시작 부분에 변수 정의

    if (tableBody) {
        const lastRow = tableBody.lastElementChild;
        if (lastRow) {
            const roleCell = lastRow.querySelector('td:nth-child(2)');
            console.log("get xpath condition : ", roleCell, roleCell.textContent.trim());
            if (roleCell && roleCell.textContent.trim() === 'Click') {
                const xpathCell = lastRow.querySelector('td:nth-child(3)');
                console.log("CELL : ", xpathCell);
                xpathValue = xpathCell ? xpathCell.textContent.trim() : null;
                console.log("XPATH VALUE : ", xpathValue);
                if (xpathValue) {
                    console.log('XPATH of the last Click event:', xpathValue);
                }
            }
        }
    }
    console.log('XPATH:', xpath)
    return xpathValue;
}