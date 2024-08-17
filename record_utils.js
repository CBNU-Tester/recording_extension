
export function sendDataToServer(data) {
    fetch('https://cbnutester.site/record/', { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        console.log('Success:', result);
        alert('Data successfully sent to the server!');
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to send data to the server.');
    });
}

// 테이블에 새로운 행을 추가하는 함수
export function addRowToTable(id, xpath, role, input, output) {
    const tableBody = document.querySelector('table tbody');

    // 새 행 생성
    const newRow = document.createElement('tr');

    // 각 셀 생성
    const idCell = document.createElement('th');
    idCell.scope = 'row';
    idCell.textContent = getTCid();
    // idCell.textContent = id;

    const roleCell = document.createElement('td');
    roleCell.textContent = role;

    const xpathCell = document.createElement('td');
    xpathCell.className = 'column';
    xpathCell.innerHTML = `<div class="column-content" id="xpath">${xpath}</div>`;

    const inputCell = document.createElement('td');
    inputCell.className = 'column';
    inputCell.innerHTML = `<div class="column-content" id="input">${input}</div>`;

    const outputCell = document.createElement('td');
    outputCell.className = 'column';
    outputCell.innerHTML = `<div class="column-content" id="output">${output}</div>`;

    const actionCell = document.createElement('td');
    actionCell.className = 'text-center-action';
    actionCell.innerHTML = `
        <button class="btn btn-success btn-spacing mod-btn" >MODIFY</button>
        <button class="btn btn-danger del-btn" >DELETE</button>
    `;

    // 새 행에 셀 추가
    newRow.appendChild(idCell);
    newRow.appendChild(roleCell);
    newRow.appendChild(xpathCell);
    newRow.appendChild(inputCell);
    newRow.appendChild(outputCell);
    newRow.appendChild(actionCell);

    // 테이블에 새 행 추가
    tableBody.appendChild(newRow);

    const deleteButton = actionCell.querySelector('.del-btn');
    deleteButton.addEventListener('click', function() {
        newRow.remove();  // 해당 행을 삭제
        reSortTCid();  // TCid 재정렬
    });

}

function reSortTCid() {
    const tableBody = document.querySelector('table tbody');
    const rows = tableBody.querySelectorAll('tr');

    rows.forEach((row, index) => {
        const idCell = row.querySelector('th');
        idCell.textContent = index + 1;
    });
}
// TCid를 얻어오는 함수
function getTCid() {
    const tableBody = document.querySelector('table tbody');
    const rows = tableBody.querySelectorAll('tr');

    // 테이블이 비어 있는 경우 TCid를 1로 초기화
    if (rows.length === 0) {
        return 1;
    }

    // 마지막 행의 idCell에서 TCid 가져오기
    const lastRow = rows[rows.length - 1];
    const lastTCid = parseInt(lastRow.querySelector('th').textContent);

    // TCid에 1을 더해 반환
    return lastTCid + 1;
}