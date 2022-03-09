console.log("hello");

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

let bankBalance = 0.0;
let computers = [];

//Fetch the computerdata
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

const addComputerToList = (computer) => {
    const computerElement = document.createElement("option");
    computerElement.value = computer.id;
    computerElement.appendChild(document.createTextNode(computer.title));
    computersElement.appendChild(computerElement);
}

function updateSalary(){
    bankBalance += 100.00;
    paymentBalanceElement.innerText = bankBalance;
}