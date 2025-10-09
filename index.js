// const values to be used
const userInput = document.getElementById("UserInput");   
const valueInput = document.getElementById("numberInput"); 
const currencyFrom = document.getElementById("currencyFrom");
const currencyTo = document.getElementById("currencyTo");
const result = document.getElementById("currencyResult");
const convertBtn = document.querySelector(".convert");
const conversionDiv = document.querySelector(".currencyConversion");

const historyList = document.getElementById("historyList");
const clearHistoryBtn = document.getElementById("clearHistoryBtn");

let history = JSON.parse(localStorage.getItem("conversionHistory")) || [];

function updateHistory() {
  historyList.innerHTML = "";
  if (history.length === 0) {
    historyList.innerHTML = "<li>No history yet.</li>";
    return;
  }
  history.forEach(item => {
    const li = document.createElement("li");
    li.textContent = item;
    historyList.appendChild(li);
  });
}


clearHistoryBtn.addEventListener("click", () => {
  history = [];
  localStorage.removeItem("conversionHistory");
  updateHistory();
});


updateHistory();

function clearDisplay() {
  userInput.value = "";
  valueInput.value = "";
}

function deleteInput() {
  userInput.value = userInput.value.slice(0, -1);
  valueInput.value = userInput.value;
}

function appendToUserInput(value) {
  if (value === "." && userInput.value.includes(".")){ 
    return; 
  }
  userInput.value += value;
  valueInput.value = userInput.value;
}

function calculateResult() {
  valueInput.value = userInput.value;
  convertBtn.click();
}

function swap(){

  const temp = currencyFrom.value;
  currencyFrom.value = currencyTo.value;
  currencyTo.value = temp;

  convertBtn.click();
}

valueInput.addEventListener("input", () => {
  userInput.value = valueInput.value;
});

convertBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  


  const amount = parseFloat(valueInput.value);
  
  // input validation
  if (isNaN(amount) || amount <= 0) {
    result.textContent = "Enter a valid amount.";
    return;
  }


  // makes sure that the values are all in uppercase for validation
  const from = currencyFrom.value.toUpperCase();
  const to = currencyTo.value.toUpperCase();

  const apiKey = "cur_live_FFORayCQBezLFWpQC5KjJMVzLPTTO66d7R34Nhtn";

  try {
    // fetch latest rates of the from and to values (PHP, USD, etc.)
    let url = `https://api.currencyapi.com/v3/latest?apikey=${apiKey}&base_currency=${from}&currencies=${to}`;

    const response = await fetch(url); // waiting for response
    const data = await response.json(); // get data

    // conditions if response is true, data was fetched and the currency rate to be converted was fetched
    if (response.ok && data.data && data.data[to]) { 
      const rate = data.data[to].value; // rate of to be converted currency
      const convertedAmount = (rate * amount).toFixed(2); // manual calculation up to two decimals
      conversionDiv.style.display = 'flex';
      result.textContent = `${convertedAmount} ${to} \n Exchange rate: 1 ${from} = ${rate.toFixed(2)} ${to}`; // print the results to the website

    const entry = `${amount} ${from} → ${convertedAmount} ${to} \n Exchange rate: 1 ${from} = ${rate.toFixed(2)} ${to}`;
    history.unshift(entry);
    if (history.length > 5) history.pop();
    localStorage.setItem("conversionHistory", JSON.stringify(history));
    updateHistory();
  
    } else {
      result.textContent = "Conversion rate not available.";
    }
  } catch (error) {
    result.textContent = "Error fetching currency rates.";
    console.error(error);
  }
});