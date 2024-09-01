// let isListenerActive = false; // 이벤트 리스너 상태를 관리하는 변수

chrome.storage.local.get(["script_valid"], (result) => {
    const valid = result.script_valid;
    if (valid) {

        // 클릭 이벤트 리스너 등록
        document.addEventListener('click', handleElementClick);
        chrome.storage.local.get(["lastURL"], (result) => {
            console.log("lasturl : ",result.lastURL);
            console.log("cur : ",location.href);
            if (result.lastURL === undefined) {
                // 최초 실행 시 lastURL을 현재 URL로 설정
                currentURL=location.href;
                console.log("currentURL : ", currentURL);
                chrome.storage.local.set({ "lastURL": currentURL });
                return;
            }
        });
        // URL 변경 이벤트 리스너 등록
        navigation.addEventListener("navigate",(event)=>{
            handleURLChange(event);
        });

        // 입력 이벤트 리스너 등록
        // if (!isListenerActive) {
            document.addEventListener('keydown', handleInputChange);
            document.addEventListener('blur', handleInputChange, true); // capture 단계에서 blur 이벤트 감지
            // isListenerActive = true; // 이벤트 리스너가 등록된 상태
        // }
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

function handleURLChange(event) {
    const currentURL = location.href;

    // 목적지 URL을 이벤트 객체에서 가져옴
    const newURL = event.destination.url;

    chrome.storage.local.get(["lastURL"], (result) => {
        console.log("result of lastURL : ", result.lastURL);
        console.log("currentURL : ", currentURL);
        console.log("newURL : ", newURL); // 이동할 목적지 URL 출력
        
        if (result.lastURL === undefined) {
            // 최초 실행 시 lastURL을 현재 URL로 설정
            chrome.storage.local.set({ "lastURL": currentURL });
            return;
        }

        const storedLastURL = result.lastURL;
        if (storedLastURL !== newURL) {
            chrome.storage.local.set({ "lastURL": newURL });
            console.log("send message URL change", storedLastURL, newURL);
            recordURLChange(storedLastURL, newURL); // URL 변경 기록 함수 호출
        }
    });
}


// function handleURLChange() {
//     console.log("URL changed")
//     const currentURL = location.href;
//     chrome.storage.local.get(["lastURL"], (result) => {
//         console.log("result of lastURL : ",result.lastURL);
//         console.log("currentURL : ",currentURL);
//         if (result.lastURL === undefined) {
//             chrome.storage.local.set({ "lastURL": currentURL });
//             return
//         }
//         const storedLastURL = result.lastURL || lastURL;
//         if (storedLastURL !== currentURL) {
//             lastURL = currentURL;
//             chrome.storage.local.set({ "lastURL": currentURL });
//             console.log("send message URL change",storedLastURL, currentURL);
//             recordURLChange(storedLastURL, currentURL);
//         }
//     });
// }

function recordURLChange(pastURL, url) {
    let test_case = {
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
function getXPath(element) {
    if (element.id !== '') {
        return '//*[@id="' + element.id + '"]';
    }
    if (element === document.body) {
        return '/html/body';
    }
    
    var index = 1;
    var siblings = element.parentNode.childNodes;
    for (var i = 0; i < siblings.length; i++) {
        var sibling = siblings[i];
        if (sibling === element) {
            return getXPath(element.parentNode) + '/' + element.tagName.toLowerCase() + '[' + index + ']';
        }
        if (sibling.nodeType === 1 && sibling.tagName === element.tagName) {
            index++;
        }
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
