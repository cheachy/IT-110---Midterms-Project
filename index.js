// const values to be used
const valueInput = document.getElementById("numberInput");
const currencyFrom = document.getElementById("currencyFrom");
const currencyTo = document.getElementById("currencyTo");
const result = document.getElementById("currencyResult");
const convertBtn = document.querySelector(".convert");
const conversionDiv = document.querySelector(".currencyConversion");

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
      result.textContent = `${convertedAmount} ${to}`; // print the results to the website
    } else {
      result.textContent = "Conversion rate not available.";
    }
  } catch (error) {
    result.textContent = "Error fetching currency rates.";
    console.error(error);
  }
});