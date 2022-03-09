const bankBalanceElement = document.getElementById("bankBalance");
const loanBalanceElement = document.getElementById("loanBalance");
const loanButtonElement = document.getElementById("loan");
const paymentBalanceElement = document.getElementById("paymentBalance");
const bankButtonElement = document.getElementById("bank");
const salaryButtonElement = document.getElementById("salary");
const computersElement = document.getElementById("computers");
const specsElement = document.getElementById("specs");
let imageElement = document.getElementById("image");
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
    specsElement.innerText = computersData[0].specs;
    titleElement.innerText = computersData[0].title;
    descriptionElement.innerText = computersData[0].description;
    priceElement.innerText = computersData[0].price;
    imageElement.src = "https://noroff-komputer-store-api.herokuapp.com/" + computersData[0].image;
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

//Prompt user to insert the amount for a loan and check against the actual loanBalance and bankBalance
function applyForLoan(){

        if(loanBalance != 0.0){
            throwAlert("You already have a loan, you can not loan any more money.")   
        }
        else{
            const loanAmount = Number(window.prompt("How much would you like to loan?", "Amount"));
            checkValidLoanAmount(loanAmount);
        }
}

//Check type of user input and against the actual loanBalance and bankBalance
function checkValidLoanAmount(amount){

    if(amount.isNan | typeof amount == 'string' | amount == null){
        throwAlert("Please insert a valid amount")
    }
    else if(amount/bankBalance > 2){
        throwAlert("The amount you can loan cannot be more than double your bankaccount")
    }
    else{
        loanBalance = amount
        loanBalanceElement.innerText = amount
    }
}

//Custom throw alert
function throwAlert(message){
    return alert(message)
}

//Show data of computer from dropdow
const handleComputerListChange = e => {
    const selectedComputer = computers[e.target.selectedIndex];
    specsElement.innerText = selectedComputer.specs;
    titleElement.innerText = selectedComputer.title;
    descriptionElement.innerText = selectedComputer.description;
    priceElement.innerText = selectedComputer.price;
    imageElement.src = "https://noroff-komputer-store-api.herokuapp.com/" + selectedComputer.image;
    imageElement.alt = selectedComputer.title;
}

computersElement.addEventListener('change', handleComputerListChange);


