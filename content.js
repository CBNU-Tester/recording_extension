// let isListenerActive = false; // 이벤트 리스너 상태를 관리하는 변수

chrome.storage.local.get(["script_valid"], (result) => {
    const valid = result.script_valid;
    if (valid) {

        // 클릭 이벤트 리스너 등록
        chrome.storage.local.get(["lastURL"], (result) => {
            console.log("on storage url : ", result.lastURL);
            if (result.lastURL === undefined) {
                // 최초 실행 시 lastURL을 현재 URL로 설정
                currentURL=location.href;
                console.log("currentURL : ", currentURL);
                chrome.storage.local.set({ "lastURL": currentURL });
                return;
            }
        });
        document.addEventListener('click', handleElementClick,true);
        navigation.addEventListener("navigate",(event)=>{handleURLChange(event);}); // url change event listener
        document.addEventListener('keydown', handleInputChange);
        document.addEventListener('focus', handleFocus);
        document.addEventListener('blur', handleInputChange, false); // capture 단계에서 blur 이벤트 감지

    }
});
function handleFocus(event) {
    const inputElement = event.target;
    console.log("Focus event detected on: ", inputElement);
}
function handleInputChange(event) {
    const inputElement = event.target;
    console.log("Event type:  Event Key : ", event.type,event.key);
    console.log("Event target: ", inputElement);
    console.log("Event target target: ", inputElement.tagName);

    const xpath = getXPath(inputElement);
    make_box(xpath);
    // keydown 이벤트에서 Enter 키 감지 및 blur 이벤트 감지
    if (event.type === 'keydown' && event.key !== 'Enter' && event.keyCode!==9) {
        console.log('Keydown event detected continue');
        return;
    }

    // 입력 요소만 처리
    if (inputElement.tagName !== 'INPUT' && inputElement.tagName !== 'TEXTAREA') {
        console.log('Not an input element');
        return;
    }


    // Enter 키를 누르거나 blur 이벤트가 발생하면 메시지 전송
    if (event.type === 'keydown' && event.keyCode === 13) {
        console.log('Enter key detected');
        sendMessage(xpath, inputElement.value);
    } 
    if(event.type==='keydown' && event.keyCode===9){
        console.log('Tab key detected');
        sendMessage(xpath, inputElement.value);
    }
    if (event.type === 'blur') {
        console.log('Blur event detected');
        sendMessage(xpath, inputElement.value);
    }
}

function sendMessage(xpath, value) {
    const test_case = {
        "role": "Input",
        "xpath": xpath,
        "input": value,
        "output": "None"
    };

    chrome.runtime.sendMessage({
        action: "updateInput",
        test_case: test_case
    });
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
    console.log('URL changed');
    const currentURL = location.href;

    // 목적지 URL을 이벤트 객체에서 가져옴
    const newURL = event.destination.url;

    chrome.storage.local.get(["lastURL"], (result) => {
        console.log("storage url : ", result.lastURL);
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
