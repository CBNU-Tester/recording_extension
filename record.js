
document.addEventListener('DOMContentLoaded', function () {
    let recordBtn = document.getElementById('record-btn');
    recordBtn.addEventListener('click', record);
});

function record() {
    chrome.runtime.sendMessage({action: "openNewWindow", url: "https://www.google.com"});
}
