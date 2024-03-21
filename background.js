chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "openNewWindow") {
        console.log("google")
        chrome.windows.create({url: request.url}, function(window) {
            let tab = window.tabs[0];
            console.log(JSON.stringify(tab));
            chrome.scripting.executeScript({
                target: { tabId: tab.id },
                files: ['content.js'],
            }).then(() => {
                console.log("Script executed");
            });
        });
    }
});
// function tmp() {
//     document.addEventListener('click', function(event) {
//         alert("clicked");
//         handleElementClick(event)
//     });
// }
// function handleElementClick(event) {
//     alert("clicked");
//     var clickedElement = event.target;
//     var xpath = getXPath(clickedElement);
//     console.log(xpath)
//     // make_box(xpath);
    
// }

// // 요소의 XPath를 추출하는 함수
// function getXPath(element) {
//     if (element.id !== '')
//         return 'id("' + element.id + '")';
//     if (element === document.body)
//         return element.tagName;
//     var siblings = element.parentNode.childNodes;
//     for (var i = 0; i < siblings.length; i++) {
//         var sibling = siblings[i];
//         if (sibling === element)
//             return getXPath(element.parentNode) + '/' + element.tagName + '[' + (i + 1) + ']';
//     }
// }
// function make_box(xpath) {
//     var blackBar = document.createElement('div');
//     blackBar.style.position = 'fixed';
//     blackBar.style.top = '0';
//     blackBar.style.left = '0';
//     blackBar.style.width = '100%';
//     blackBar.style.height = '30px';
//     blackBar.style.backgroundColor = 'black';
//     blackBar.style.color = 'white';
//     blackBar.style.padding = '5px';
//     blackBar.style.boxSizing = 'border-box';
//     blackBar.style.zIndex = '9999';
//     blackBar.innerText = 'Current Element XPath: ' + xpath;
//     document.body.appendChild(blackBar);
// }
