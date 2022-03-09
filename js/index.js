const bankBalanceElement = document.getElementById("bankBalance");
const loanBalanceElement = document.getElementById("loanBalance");
const loanButtonElement = document.getElementById("loan");
const paymentBalanceElement = document.getElementById("paymentBalance");
const bankButtonElement = document.getElementById("bank");
const salaryButtonElement = document.getElementById("salary");
const computersElement = document.getElementById("computers");
const specsElement = document.getElementById("specs");
const imageElement = document.getElementById("image");
const titleElement = document.getElementById("title");
const descriptionElement = document.getElementById("description");
const priceElement = document.getElementById("price");
const buyButtonElement = document.getElementById("buy");

let paymentBalance = 0.0;
let bankBalance = paymentBalance;
let loanBalance = 0.0;
let computers = [];

//fetch the computerdata
fetch("https://noroff-komputer-store-api.herokuapp.com/computers")
.then(response => response.json())
.then(data => computers = data)
.then(computersData => addComputersToList(computersData))
.catch(function(err){
    console.log(err);
})

const addComputersToList = (computersData) => {
    computersData.forEach(x => addComputerToList(x));
}

//appending computertitles to the dropdownment
const addComputerToList = (computer) => {
    const computerElement = document.createElement("option");
    computerElement.value = computer.id;
    computerElement.appendChild(document.createTextNode(computer.title));
    computersElement.appendChild(computerElement);
}

//update paymentBalance by 100 on each click
function updateSalary(){
    paymentBalance += 100.00;
    paymentBalanceElement.innerText = paymentBalance;
}

//update bankBalance by moving paymentBalance to bankBalance and setting paymentBalance to 0
function moveSalaryToBank(){

    //get 10% of salary for loan payment
    const tenPercentOfSalaryToBank = (10 / 100) * paymentBalance;
    let toBankBalance = paymentBalance - tenPercentOfSalaryToBank;
    
    if(loanBalance === 0.0){
        bankBalance += paymentBalance;
    }
    else if(loanBalance > tenPercentOfSalaryToBank){
        loanBalance -= tenPercentOfSalaryToBank
        bankBalance += toBankBalance
    }
    else if(loanBalance < tenPercentOfSalaryToBank ){
        loanBalance = 0.0;
        toBankBalance += (tenPercentOfSalaryToBank - loanBalance);
        bankBalance += toBankBalance;
    }
    
    paymentBalance = 0.0;
    bankBalanceElement.innerText = bankBalance;
    loanBalanceElement.innerText = loanBalance;
    paymentBalanceElement.innerText = paymentBalance;
}


