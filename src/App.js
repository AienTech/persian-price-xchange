import { useEffect, useState } from 'react';
import { registeredKeys, transformPrices, DEFAULT_CURRENCY, getExchangeRate, parseNumberToCurrencyFormat } from './utils';

function App()
{
  const [currencies, setCurrencies] = useState([]);
  const [originalCurrencies, setOriginalCurrencies] = useState([]);
  const [rootValue, setRootValue] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState(registeredKeys[DEFAULT_CURRENCY]);

  useEffect(() =>
  {
    fetch('https://call1.tgju.org/ajax.json')
      .then(res => res.json())
      .then(res =>
      {
        const priceList = transformPrices(res.current);

        setCurrencies(priceList);
        setOriginalCurrencies(priceList);
      });
  }, []);

  useEffect(() =>
  {
    setRootValue('');
    if (selectedCurrency.id === DEFAULT_CURRENCY)
      setCurrencies(originalCurrencies);
    else
    {
      const newPriceList = originalCurrencies.map(p => ({
        ...p,
        price: selectedCurrency.price / p.price
      }));

      setCurrencies(newPriceList);
    }
  }, [selectedCurrency]);

  return (
    <>
      <div className="py-10 px-4">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-700">مبدل ارز</h1>
          <p className="text-gray-500">ارزهای رایج رو به قیمت بازار آزاد روز به هم تبدیل کنید</p>
        </div>

        <div className="max-w-2xl mx-auto bg-white p-6 rounded-md shadow-md">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-3">قیمت‌های روز:</h2>
            <ul>
              {currencies.filter(c => c.id !== selectedCurrency.id).map(currency => (
                <li key={currency.id} className="flex justify-between">
                  <span className="text-gray-600">{currency.name}:</span>
                  <span className="text-gray-800">{parseNumberToCurrencyFormat(currency.price, currency)}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-6">
            <label htmlFor="defaultCurrency" className="block text-gray-600 mb-2">ارز مبدا رو انتخاب کنید:</label>
            <select
              id="defaultCurrency"
              className="w-full p-2 border rounded-md"
              value={selectedCurrency.id}
              onChange={(e) => setSelectedCurrency(originalCurrencies.find(c => c.id === e.target.value))}
            >
              {currencies.map(currency => (
                <option key={currency.id} value={currency.id}>
                  {currency.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-6">
            <label htmlFor="amount" className="block text-gray-600 mb-2">مقدار مورد نیاز:</label>
            <input
              type="number"
              id="amount"
              className="w-full p-2 border rounded-md"
              placeholder="مقدار مورد نیاز شما برای تبدیل"
              value={rootValue}
              onChange={(e) => setRootValue(e.target.value)}
            />
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-3">قیمت‌های تبدیل شده:</h2>
            <ul>
              {currencies.filter(c => c.id !== selectedCurrency.id).map((currency) => (
                <li key={currency.id} className="flex justify-between">
                  <span className="text-gray-600">{currency.name}:</span>
                  <span className="text-gray-800">{
                    rootValue === ''
                      ? <span>{parseNumberToCurrencyFormat(currency.price, currency)}</span>
                      : <p>
                        {parseNumberToCurrencyFormat((
                          parseFloat(rootValue) === 1
                            ? 1 / currency.price
                            : getExchangeRate(selectedCurrency.id, currency.id, originalCurrencies) * rootValue
                        ), currency)}
                      </p>
                  }</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
