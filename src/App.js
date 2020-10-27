import React, { useEffect, useState } from 'react';
import CurrencyRow from './Components/currency-row';
import './App.css';

const BASE_URL = "https://api.exchangeratesapi.io/latest";

function App() {

  const [currencyOption, setCurrencyOption] = useState([]);
  const [fromCurrency, setFromCurrrency] = useState();
  const [toCurrency, setToCurrrency] = useState();
  const [exchangeRate, setExchangeRate] = useState();
  const [amount, setAmount] = useState(1);
  const [amountInFromCurrency, setAmountInFromCurrency] = useState(true);

  let toAmount, fromAmount;

  if (amountInFromCurrency) {
    fromAmount = amount;
    toAmount = amount * exchangeRate;
  } else {
    toAmount = amount;
    fromAmount = amount / exchangeRate;
  }

  useEffect(() => {
    fetch(BASE_URL)
      .then(res => res.json())
      .then(data => {
        console.log(data)
        const firstCurrency = Object.keys(data.rates)[0];
        setCurrencyOption([data.base, ...Object.keys(data.rates)])
        setFromCurrrency(data.base)
        setToCurrrency(firstCurrency)
        setExchangeRate(data.rates[firstCurrency]);
      })
  }, [])

  useEffect(() => {
    if(fromCurrency != null && toCurrency != null) 
    {fetch(`${BASE_URL}?base=${fromCurrency}&symbols=${toCurrency}`)
    .then(res => res.json())
    .then(data => setExchangeRate(data.rates[toCurrency]))}
  }, [fromCurrency, toCurrency])

  const handleFromAmountChange = (e) => {
    setAmount(e.target.value)
    setAmountInFromCurrency(true)
  }

  const handleToAmountChange = (e) => {
    setAmount(e.target.value)
    setAmountInFromCurrency(false)
  }

  return (
    <>
      <h1>Convert</h1>
      <CurrencyRow
        currencyOption={currencyOption}
        selectedCurrency={fromCurrency}
        onChangeCurrency={e => setFromCurrrency(e.target.value)}
        onChangeAmount={handleFromAmountChange}
        amount={fromAmount}
      />
      <div className='equals'>=</div>
      <CurrencyRow
        currencyOption={currencyOption}
        selectedCurrency={toCurrency}
        onChangeCurrency={e => setToCurrrency(e.target.value)}
        onChangeAmount={handleToAmountChange}
        amount={toAmount}
      />
    </>
  );
}

export default App;
