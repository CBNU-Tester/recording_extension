/**
 * extension의 record 버튼 클릭 시 실행되는 스크립트
 * @todo 해당 클릭 이벤트 xpath 정보를 extension index.html에 전달
 * @todo 해당 클릭 이벤트 xpath 정보를 서버에 전달
 **/
let valid=false; 
let test_case_id=0;
chrome.storage.local.get(["script_valid"], (result) => {
    valid = result.script_valid;
    if (valid)
        document.addEventListener('click', function(event) {
            handleElementClick(event)
        });
});



function handleElementClick(event) {
    var clickedElement = event.target;
    var xpath = getXPath(clickedElement);
    make_box(xpath);
    test_case_id+=1;
    test_case={
        "id": test_case_id,
        "role":"None",
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
