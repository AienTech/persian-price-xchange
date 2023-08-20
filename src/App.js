import { useState } from 'react';
import { fetchPrices, getExchangeRate, parseNumberToCurrencyFormat } from './utils';
import { useQuery } from 'react-query';

const DEFAULT_CURRENCY_ID = 'toman';

function App()
{
  const [rootValue, setRootValue] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState();

  const { isLoading, data: currencies } = useQuery('prices', fetchPrices);

  return (
    <>
      <div className="py-10 px-4">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-700">مبدل ارز</h1>
          <p className="text-gray-500">ارزهای رایج رو به قیمت بازار آزاد روز به هم تبدیل کنید</p>
        </div>

        <div className="max-w-2xl mx-auto bg-white p-6 rounded-md shadow-md">
          {
            isLoading && <p>در حال بارگزاری...</p>
          }
          {
            !isLoading && <>
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-3">قیمت‌های روز:</h2>
                <ul>
                  {currencies.filter(c => c.id !== (selectedCurrency?.id || DEFAULT_CURRENCY_ID)).map(currency => (
                    <li key={currency.id} className="flex justify-between">
                      <span className="text-gray-600">{currency.name}:</span>
                      <span className="text-gray-800">{parseNumberToCurrencyFormat(
                        getExchangeRate(
                          currency.id,
                          (selectedCurrency?.id || DEFAULT_CURRENCY_ID),
                          currencies
                        ), currency,
                        currencies
                      )}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-6">
                <label htmlFor="defaultCurrency" className="block text-gray-600 mb-2">ارز مبدا رو انتخاب کنید:</label>
                <select
                  id="defaultCurrency"
                  className="w-full p-2 border rounded-md"
                  value={selectedCurrency?.id || DEFAULT_CURRENCY_ID}
                  onChange={(e) => setSelectedCurrency(currencies.find(c => c.id === e.target.value))}
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
                  placeholder={`${selectedCurrency?.name || "مقدار"} مورد نیاز برای تبدیل`}
                  value={rootValue}
                  onChange={(e) => setRootValue(e.target.value)}
                />
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-3">قیمت‌های تبدیل شده:</h2>
                <ul>
                  {currencies.filter(c => c.id !== (selectedCurrency?.id || DEFAULT_CURRENCY_ID)).map((currency) => (
                    <li key={currency.id} className="flex justify-between">
                      <span className="text-gray-600">{currency.name}:</span>
                      <span className="text-gray-800">{
                        rootValue === ''
                          ? <span>{parseNumberToCurrencyFormat(currency.price, currency, currencies)}</span>
                          : <p>
                            {parseNumberToCurrencyFormat((
                              parseFloat(rootValue) === 1
                                ? 1 / currency.price
                                : getExchangeRate((selectedCurrency?.id || DEFAULT_CURRENCY_ID), currency.id, currencies) * rootValue
                            ), currency, currencies)}
                          </p>
                      }</span>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          }
        </div>
      </div>
    </>
  );
}

export default App;
