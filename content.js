let isListenerActive = false; // 이벤트 리스너 상태를 관리하는 변수

chrome.storage.local.get(["script_valid"], (result) => {
    const valid = result.script_valid;

    if (valid) {
        // 현재 URL을 저장
        let lastURL = location.href;
        chrome.storage.local.set({ "lastURL": lastURL });

        // 클릭 이벤트 리스너 등록
        document.addEventListener('click', handleElementClick);

        // // URL 변경 감지
        // observeURLChanges(lastURL);

        // 입력 이벤트 리스너 등록
        if (!isListenerActive) {
            document.addEventListener('keydown', handleInputChange);
            document.addEventListener('blur', handleInputChange, true); // capture 단계에서 blur 이벤트 감지
            isListenerActive = true; // 이벤트 리스너가 등록된 상태
        }
    }
});

function handleInputChange(event) {
    const inputElement = event.target;

    // keydown 이벤트에서 Enter 키 감지 및 blur 이벤트 감지
    if (event.type === 'keydown' && event.key !== 'Enter') {
        return;
    }

    // 입력 요소만 처리
    if (inputElement.tagName !== 'INPUT' && inputElement.tagName !== 'TEXTAREA') {
        return;
    }

    const xpath = getXPath(inputElement);
    make_box(xpath);

    function sendMessage() {
        const test_case = {
            "role": "Input",
            "xpath": xpath,
            "input": inputElement.value,
            "output": "None"
        };

        chrome.runtime.sendMessage({
            action: "updateInput",
            test_case: test_case
        });
    }

    // Enter 키를 누르거나 blur 이벤트가 발생하면 메시지 전송
    if (event.type === 'keydown' && event.key === 'Enter') {
        sendMessage();
    } 
    else if (event.type === 'blur') {
        console.log('Blur event detected');
        sendMessage();
    }
    document.removeEventListener('keydown', handleInputChange);
    document.removeEventListener('blur', handleInputChange, true);
}

function handleElementClick(event) {
    console.log('Element clicked');
    // 클릭된 요소에 대한 처리 로직
    const clickedElement = event.target;
    const xpath = getXPath(clickedElement);
    make_box(xpath);
    const test_case = {
        "role": "Click",
        "xpath": xpath,
        "input": "None",
        "output": "None"
    };

    chrome.runtime.sendMessage({
        action: "updateXPath",
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

                // URL 변경 후 이벤트 리스너 상태 초기화
                if (isListenerActive) {
                    document.removeEventListener('keydown', handleInputChange);
                    document.removeEventListener('blur', handleInputChange, true);
                    isListenerActive = false; // 이벤트 리스너가 제거된 상태
                }
                document.addEventListener('keydown', handleInputChange);
                document.addEventListener('blur', handleInputChange, true);
                isListenerActive = true; // 이벤트 리스너가 등록된 상태
            }
        });
    }
}

function recordURLChange(pastURL, url) {
    test_case_id += 1;
    let test_case = {
        "id": test_case_id,
        "role": "URL Change",
        "xpath": "None",
        "input": pastURL,
        "output": url
    };
    chrome.runtime.sendMessage({
        action: "updateURL",
        test_case: test_case
    });
}

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
