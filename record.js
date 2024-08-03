import { sendDataToServer, addRowToTable } from './record_utils.js';
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


    

    // 전송 버튼 클릭 이벤트 리스너
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
    sendDataToServer(table_data);
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
    
    if (message.action==="updateInput"){
        let test_case=message.test_case;
        addRowToTable(test_case.id, test_case.xpath, test_case.role, test_case.input, test_case.output);
    }
    
    if (message.action==="updateURL"){
        let test_case=message.test_case;
        addRowToTable(test_case.id, test_case.xpath, test_case.role, test_case.input, test_case.output);
    }
});
