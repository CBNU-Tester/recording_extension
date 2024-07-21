
document.addEventListener('DOMContentLoaded', function () {
    let recordBtn = document.getElementById('record-btn');
    recordBtn.addEventListener('click', record);
});

function record() {
    chrome.runtime.sendMessage({action: "openNewWindow", url: "https://www.google.com"});
}

// 콘텐츠 스크립트에서 전달된 메시지를 수신합니다.
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.action === "updateXPath") {
        // XPath를 팝업 창의 div에 표시합니다.
        const xpathDisplay = document.getElementById('xpath-display');
        xpathDisplay.textContent = message.xpath;
    }
});