document.addEventListener('DOMContentLoaded', function () {
    let recordBtn = document.getElementById('record-btn');
    recordBtn.addEventListener('click', function () {
        // chrome.tabs.query({ active: true }),function(tabs) {
        //     let tab = tabs[0];
        //     chrome.scripting.executeScript({
        //         target: { tabId: tab.id },
        //         function: record
        //     });
        // }
        record();
    });
});



function record() {
        chrome.runtime.sendMessage({action: "openNewWindow", url: "https://www.google.com"});
        // chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        //     let tab = tabs[0];
        //     alert(JSON.stringify(tab));
        //     console.log(tab)
        //     chrome.scripting.executeScript({
        //         target: { tabId: tab.id },
        //         function: tmp
        //     });
        // });
        
}
