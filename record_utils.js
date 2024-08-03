
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
    idCell.textContent = id;

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
    // DELETE 버튼 클릭 이벤트 리스너 추가
    const delButton = newRow.querySelector('.del-btn');
    if (delButton) {
        delButton.addEventListener('click', (event) => {
            const row = event.target.closest('tr');
            if (row) {
                row.remove();
            }
        });
    }

}

