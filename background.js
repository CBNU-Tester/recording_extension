/**
 * record.js에서 오는 메시지를 받아서 새로운 창을 열고 content.js를 실행하는 스크립트
 */

// 열린 윈도우와 해당 윈도우에 적용된 content.js 스크립트를 추적하기 위한 객체
let openedWindows = {};  

// 크롬 익스텐션 열 때 화면에 채우기
chrome.action.onClicked.addListener(() => {
    chrome.system.display.getInfo((displays) => {
        const display = displays[0];
        const width = display.workArea.width;
        const height = display.workArea.height;

        chrome.windows.create({
            url: chrome.runtime.getURL("index.html"),
            type: "popup",
            left: 0,
            top: 0,
            width: width,
            height: height
        });
    });
});

// 새로운 윈도우를 열 때 처리
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "openNewWindow") {
        chrome.storage.local.set({"script_valid": true})
        chrome.windows.create(
            {
                url: request.url,
                type: "normal",
            }, 
            function(window) 
            {
                let tab = window.tabs[0]; // 새로운 창의 첫번째 탭의 정보를 가져옴
                openedWindows[window.id] = tab.id; // 열린 윈도우와 해당 탭을 매핑하여 추적
                chrome.scripting.executeScript({ // content.js를 실행
                    target: { tabId: tab.id },
                    files: ['content.js'],
                })
            });
    }
});

// 윈도우가 닫힐 때 처리
chrome.windows.onRemoved.addListener(function(windowId) {
    chrome.storage.local.set({"script_valid": false})
});

