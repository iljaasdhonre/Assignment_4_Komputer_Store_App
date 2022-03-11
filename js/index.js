const bankBalanceElement = document.getElementById("bankBalance");
const loanBalanceElement = document.getElementById("loanBalance");
const outstandingLoanElement = document.getElementById("outstandingLoan")
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
const outstandingLoanDiv = document.createElement("div");
const outstandingLoanLabel = document.createElement("label");
const outstandingLoanSpan = document.createElement("span");

//Fetch the computerdata
fetch("https://noroff-komputer-store-api.herokuapp.com/computers")
.then(response => response.json())
.then(data => computers = data)
.then(computersData => addComputersToList(computersData))
.catch(function(err){
    console.log(err);
})

//Populate list with computers and update index.html with initial computer info
const addComputersToList = (computersData) => {
    computersData.forEach(x => addComputerToList(x));
    specsElement.innerText = computersData[0].specs;
    titleElement.innerText = computersData[0].title;
    descriptionElement.innerText = computersData[0].description;
    priceElement.innerText = computersData[0].price;
    imageElement.src = "https://noroff-komputer-store-api.herokuapp.com/" + computersData[0].image;
}

//Appending computertitles to the dropdownmenu
const addComputerToList = (computer) => {
    const computerElement = document.createElement("option");
    computerElement.value = computer.id;
    computerElement.appendChild(document.createTextNode(computer.title));
    computersElement.appendChild(computerElement);
}

//Update paymentBalance by 100 on each click
const updateSalary = () => {
    paymentBalance += 100.00;
    updateBalance(paymentBalanceElement, paymentBalance);
};

//Update bankBalance by moving paymentBalance to bankBalance and setting paymentBalance to 0
function moveSalaryToBank(){

    //Get 10% of salary for loan payment
    const tenPercentOfSalaryToBank = (10 / 100) * paymentBalance;
    let toBankBalance = paymentBalance - tenPercentOfSalaryToBank;
    
    if(loanBalance === 0.0){
        bankBalance += paymentBalance;
    }
    else if(loanBalance > tenPercentOfSalaryToBank){
        loanBalance -= tenPercentOfSalaryToBank
        bankBalance += toBankBalance
        updateBalance(outstandingLoanSpan, loanBalance);
    }
    else if(loanBalance <= tenPercentOfSalaryToBank ){
        loanBalance = 0.0;
        updateDiv("remove");
        toBankBalance += (tenPercentOfSalaryToBank - loanBalance);
        bankBalance += toBankBalance;
    }

    paymentBalance = 0.0;
    updateBalance(bankBalanceElement, bankBalance);
    updateBalance(paymentBalanceElement, paymentBalance);
}

//Prompt user to insert the amount for a loan and check against the actual loanBalance and bankBalance
function applyForLoan(){

        if(loanBalance != 0.0){
            throwAlert("You already have a loan, you cannot loan any more money.")   
        }
        else{
            const loanAmount = Number(window.prompt("How much would you like to loan?", "Amount"));
            loanBalance = loanAmount;
            checkValidLoanAmount(loanAmount);
        }
}

//Check type of user input and against the actual loanBalance and bankBalance
function checkValidLoanAmount(loanAmount){

    if(Number.isNaN(loanAmount) || loanAmount == 0){
        throwAlert("Please insert a valid amount")
    }
    else if(loanAmount/bankBalance > 2){
        throwAlert("The amount you can loan cannot be more than double your bankaccount")
    }
    else{
        processLoanApplication(loanAmount);
    }
}

//Raise bankBalance with loanamount and create the outstanding loan label, amount and repay loan button.
function processLoanApplication(loanAmount){
    bankBalance += loanAmount;
    updateBalance(bankBalanceElement, bankBalance);
    updateDiv("build", loanAmount);

}

//Handle the onClick event for the buy now button
function buyComputer(){
    const laptopPrice = Number(priceElement.innerText);
    const laptopTitle = titleElement.innerText;

    if(!canBuyLaptop(laptopPrice)){
        throwAlert("You cannot afford to buy this computer");
    }
    else{
        bankBalanceElement.innerText = bankBalance;
        throwAlert("You are now the proud owner of the " + laptopTitle);
        
    }
}

//Check if the price of the computer is lower than the bankBalance and set the bankBalance lower if so
function canBuyLaptop(price){
    if(price <= bankBalance){
        bankBalance -= price;
        return true;
    }
    else{
        return false;
    }
}

//Format the given balance to currency and pass into HTMLelement
const updateBalance = (element, balance) => {
    const formattedBalance = new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(balance);
    element.innerText = formattedBalance;
}

//Show or remove div element when loan is created or paid in full
const updateDiv = (action, loanAmount) => {
    if(action === "build"){
        outstandingLoanLabel.innerText = "Outstanding loan ";
        updateBalance(outstandingLoanSpan, loanAmount)
        //outstandingLoanSpan.innerText = loanAmount;
        outstandingLoanDiv.appendChild(outstandingLoanLabel);
        outstandingLoanDiv.appendChild(outstandingLoanSpan);
        outstandingLoanElement.appendChild(outstandingLoanDiv);
    }else if(action === "remove"){
        outstandingLoanDiv.removeChild(outstandingLoanSpan);
        outstandingLoanDiv.removeChild(outstandingLoanLabel);
        outstandingLoanDiv.remove();
    }   
}

//Custom throw alert
function throwAlert(message){
    return alert(message)
}

//Show data of computer from dropdownmenu
const handleComputerListChange = e => {
    const selectedComputer = computers[e.target.selectedIndex];
    specsElement.innerText = selectedComputer.specs;
    titleElement.innerText = selectedComputer.title;
    descriptionElement.innerText = selectedComputer.description;
    priceElement.innerText = selectedComputer.price;
    imageElement.src = "https://noroff-komputer-store-api.herokuapp.com/" + selectedComputer.image;
    imageElement.alt = selectedComputer.title;
}

//Handle computer change in dropdownmenu
computersElement.addEventListener('change', handleComputerListChange);

