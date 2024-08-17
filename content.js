/**
 * extension의 record 버튼 클릭 시 실행되는 스크립트
 **/
// chrome.storage.local.set({ "script_valid": false });
chrome.storage.local.get(["script_valid"], (result) => {
    valid = result.script_valid;

    // 현재 URL을 저장
    let lastURL = location.href;
    chrome.storage.local.set({ "lastURL": lastURL });
    
    if (valid) {
        document.addEventListener('click', function(event) {
            handleElementClick(event);
        });

        // URL 변경 감지
        observeURLChanges(lastURL);

        // 입력 이벤트 리스너 등록
        document.addEventListener('input', function(event) {
            handleInputChange(event);
        });
    }
});

function handleElementClick(event) {
    var clickedElement = event.target;
    var xpath = getXPath(clickedElement);
    make_box(xpath);
    let test_case = {
        "role": "None",
        "xpath": xpath,
        "input": "None",
        "output": "None"
    }
    // XPath를 팝업 창에 전달합니다.
    chrome.runtime.sendMessage({
        action: "updateXPath",
        test_case: test_case
    });
}

function handleInputChange(event) {
    var inputElement = event.target;
    var xpath = getXPath(inputElement);
    let test_case = {
        "role": "Input",
        "xpath": xpath,
        "input": inputElement.value,
        "output": "None"
    }
    chrome.runtime.sendMessage({
        action: "updateInput",
        test_case: test_case
    });
}

function observeURLChanges(lastURL) {
    console.log('URL change observer is running');

    // URL 변경 감지를 위해 history 메서드 오버라이드
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function(...args) {
        originalPushState.apply(this, args);
        handleURLChange();
    };

    history.replaceState = function(...args) {
        originalReplaceState.apply(this, args);
        handleURLChange();
    };

    window.addEventListener('popstate', handleURLChange);

    function handleURLChange() {
        const currentURL = location.href;
        chrome.storage.local.get(["lastURL"], (result) => {
            const storedLastURL = result.lastURL || lastURL;
            if (storedLastURL !== currentURL) {
                lastURL = currentURL;
                chrome.storage.local.set({ "lastURL": currentURL });
                recordURLChange(storedLastURL, currentURL);
            }
        });
    }
}


function recordURLChange(pastURL,url) {
    test_case_id += 1;
    let test_case = {
        "id": test_case_id,
        "role": "URL Change",
        "xpath": "None",
        "input": pastURL,
        "output": url
    }
    chrome.runtime.sendMessage({
        action: "updateURL",
        test_case: test_case
    });
}

// 요소의 XPath를 추출하는 함수
function getXPath(element) {
    if (element.id !== '')
        return 'id("' + element.id + '")';
    if (element === document.body)
        return element.tagName;
    var siblings = element.parentNode.childNodes;
    for (var i = 0; i < siblings.length; i++) {
        var sibling = siblings[i];
        if (sibling === element)
            return getXPath(element.parentNode) + '/' + element.tagName + '[' + (i + 1) + ']';
    }
}

// 요소의 XPath를 표시하는 함수
function make_box(xpath) {
    var blackBar = document.createElement('div');
    blackBar.style.position = 'fixed';
    blackBar.style.top = '0';
    blackBar.style.left = '0';
    blackBar.style.width = '100%';
    blackBar.style.height = '30px';
    blackBar.style.backgroundColor = 'black';
    blackBar.style.color = 'white';
    blackBar.style.padding = '5px';
    blackBar.style.boxSizing = 'border-box';
    blackBar.style.zIndex = '9999';
    blackBar.innerText = 'Current Element XPath: ' + xpath;
    document.body.appendChild(blackBar);
}
