let price = 1.26;
let cid =
    [["PENNY", 1.01], ["NICKEL", 2.05], ["DIME", 3.1], ["QUARTER", 4.25], ["ONE", 90], ["FIVE", 55], ["TEN", 20], ["TWENTY", 60], ["ONE HUNDRED", 100]];

const cash = document.getElementById("cash");
const givenChange = document.getElementById("change-due");
const purchaseBtn = document.getElementById("purchase-btn");
const maxMinus = [100, 20, 10, 5, 1, 0.25, 0.1, 0.05, 0.01];
let result = { status: 'OPEN', change: [] };

cash.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
        CashChange();
        cash.value = '';
    }
});
purchaseBtn.addEventListener("click", () => {
    if (!cash.value) {
        return;
      }
      CashChange();
});

function formatResults(status, change) {
    givenChange.innerHTML = `<p>Status: ${status}</p>`;
    change.map(
        money => (givenChange.innerHTML += `<p>${money[0]}: $${money[1]}</p>`)
    );
    return;
};

function CashChange() {
    if (Number(cash.value) === price) {
        givenChange.innerHTML = '<p>No change due - customer paid with exact cash</p>';
        cash.value = '';
        return;
    } if (Number(cash.value) < price) {
        alert("Customer does not have enough money to purchase the item");
        cash.value = '';
        return;
    }
    let reversedCid = cid.reverse();
    let changeDue = Number(cash.value) - price;
    let sum = cid.reduce((accumulator, currentValue) => {
        if (typeof currentValue[1] === 'number') {
            return accumulator + currentValue[1];
        } else {
            return accumulator;
        }
    }, 0).toFixed(2);

    if (Number(sum) < changeDue) {
        givenChange.innerHTML = '<p>Status: INSUFFICIENT_FUNDS</p>'
        return;
    }

    if (Number(sum) === changeDue) {
        result.status = 'CLOSED';
    }

    for (let i = 0; i < reversedCid.length; i++) {
        if (changeDue > maxMinus[i] && changeDue > 0) {
            let count = 0;
            let currencyValue = reversedCid[i][1];
            while (currencyValue > 0 && changeDue >= maxMinus[i]) {
                currencyValue -= maxMinus[i];
                changeDue = parseFloat((changeDue -= maxMinus[i]).toFixed(2));
                count++;
            }
            if (count > 0) {
                result.change.push([reversedCid[i][0], count * maxMinus[i]]);
            }
        }
    }
    if (changeDue > 0) {
        givenChange.innerHTML = '<p>Status: INSUFFICIENT_FUNDS</p>';
        return;
    }
    console.log(cid);
    formatResults(result.status, result.change);
}
