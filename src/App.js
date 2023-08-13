import { useEffect, useState } from 'react';
import { registeredKeys, transformPrices, DEFAULT_CURRENCY, getExchangeRate } from './utils';

function App()
{
  const [currencies, setCurrencies] = useState([]);
  const [originalCurrencies, setOriginalCurrencies] = useState([]);
  const [rootValue, setRootValue] = useState(0);
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
    setRootValue(1);
    if (selectedCurrency.id === DEFAULT_CURRENCY)
      setCurrencies(originalCurrencies);
    else
    {
      const newPriceList = originalCurrencies.map(p => ({
        ...p,
        amount: selectedCurrency.amount / p.amount
      }));

      setCurrencies(newPriceList);
    }
  }, [selectedCurrency]);

  return (
    <div className='flex flex-col'>
      <div className='my-8'>
        <div className='flex flex-row-reverse items-center justify-center'>
          <input className='border p-3 ltr' defaultValue={0} value={rootValue} onChange={e => setRootValue(e.target.value)} />
          <span className='p-3'>{selectedCurrency.name}</span>
        </div>
      </div>
      <div className="w-full divide-y divide-gray-200 overflow-hidden">
        <div className="bg-gray-50 hidden md:flex py-3">
          <div className="px-6 flex-1 text-center font-medium text-gray-500 uppercase tracking-wider">نام ارز</div>
          <div className="px-6 flex-1 text-center font-medium text-gray-500 uppercase tracking-wider">قیمت</div>
          <div className="px-6 flex-1 text-center font-medium text-gray-500 uppercase tracking-wider"></div>
        </div>
        <div>
          {
            currencies.map((currency, idx) =>
            {
              return (
                <div key={idx} className="md:flex md:flex-row flex-col text-center py-4 border-b items-center">
                  <div className="md:flex-1 font-medium md:tracking-wider px-6 whitespace-nowrap">{currency.name}</div>
                  <div className="md:flex-1 md:tracking-wider px-6 whitespace-nowrap rtl text-center justify-between">
                    <span className='m-1'>{rootValue}</span>
                    <span className='m-1'>{selectedCurrency.name}</span>
                    <span className='m-1'>=</span>
                    <span className='m-1'>
                      {parseFloat(parseFloat(
                        rootValue === 1
                          ? currency.amount
                          : getExchangeRate(selectedCurrency.id, currency.id, originalCurrencies) * rootValue
                      ).toFixed(2)).toLocaleString('en-US', {
                        type: 'currency',
                        currency: currency.type,
                        minimumFractionDigits: currency.id === DEFAULT_CURRENCY ? 0 : 2,
                        useGrouping: 'always',
                      })}
                    </span>
                    <span className='m-1'>{currency.name}</span>
                  </div>
                  <div className="md:flex-1 md:tracking-wider px-6 whitespace-nowrap">
                    <button
                      onClick={() => setSelectedCurrency(currency)}
                      className='m-2 p-2 bg-blue-600 text-blue-50 rounded'>{`انتخاب ${currency.name} به عنوان ارز مبدا`}</button>
                  </div>
                </div>
              );
            })
          }
        </div>
      </div>

    </div>
  );
}

export default App;
