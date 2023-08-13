import { useEffect, useState } from 'react';
import './App.css';

const registeredKeys = ['price_dollar_dt', 'price_eur', 'price_try'];

function App()
{
  const [prices, setPrices] = useState([]);
  const [basePrices, setBasePrices] = useState([]);
  const [rootValue, setRootValue] = useState(0);
  const [currency, setCurrency] = useState(registeredKeys.length);

  useEffect(() =>
  {
    fetch('https://call1.tgju.org/ajax.json')
      .then(res => res.json())
      .then(res =>
      {
        const priceList = Object.keys(res.current)
          .filter(k => registeredKeys.includes(k))
          .map(k =>
          {
            const amount = parseInt(res.current[k].p?.replace(",", "") || "0") / 10;

            return {
              name: k.replace("_", " ").replace("price", ""),
              amount
            };
          });


        priceList.push({
          name: 'toman',
          amount: 1
        });

        setPrices(priceList);
        setBasePrices(priceList);
      });
  }, []);

  useEffect(() =>
  {
    if (currency === basePrices.length - 1)
      setPrices(basePrices);
    else
    {
      const price = basePrices[currency]?.amount || 0;

      const newPriceList = basePrices.map(p => ({
        ...p,
        amount: price / p.amount
      }));

      setPrices(newPriceList);
    }
  }, [currency]);

  return (
    <div className="App">
      <div className='flex flex-col m-32'>
        <div className='w-full mb-8'>
          <div className='flex items-center justify-center'>
            <input className='border p-3' defaultValue={0} onChange={e => setRootValue(e.target.value)} />
            <span className='p-3'>{prices[currency]?.name}</span>
          </div>
        </div>
        <div className='w-full'>
          <table className='table w-full'>
            <thead className='table-header-group'>
              <tr className='table-row'>
                <th className='table-cell border-b text-bold'></th>
                <th className='table-cell border-b text-bold'>Name</th>
                <th className='table-cell border-b text-bold'>Price</th>
                <th className='table-cell border-b text-bold'></th>
              </tr>
            </thead>
            <tbody>
              {
                prices.map((price, idx) =>
                {
                  return <tr className='table-row'>
                    <td className='table-cell border-b'>{idx + 1}</td>
                    <td className='table-cell border-b'>{price.name}</td>
                    <td className='table-cell border-b'>{
                      parseFloat((rootValue < 1 ? price.amount : currency === registeredKeys.length ? rootValue / price.amount : rootValue * price.amount))
                        .toLocaleString({
                          style: 'currency',
                          minimumFractionDigits: 2,
                          useGrouping: 'always',
                          currencyDisplay: 'code',
                          currencySign: 'accounting'
                        })
                    }</td>
                    <td className='table-cell border-b'>
                      <button
                        onClick={() => setCurrency(idx)}
                        className='m-2 p-2 bg-blue-500 text-blue-50 rounded'>Set currency</button>
                    </td>
                  </tr>;
                })
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;
