export function getExchangeRate(c1, c2, currencies)
{
	const currency1 = currencies.find(currency => currency.id === c1);
	const currency2 = currencies.find(currency => currency.id === c2);

	if (!currency1 || !currency2)
	{
		throw new Error('invalid currency IDs provided');
	}

	return currency1.price / currency2.price;
}

export function parseNumberToCurrencyFormat(num, currency, currencies)
{
	return parseFloat(num)
		.toFixed(2)
		.toLocaleString('fa-IR', {
			type: 'currency',
			currency: currency.type,
			minimumFractionDigits: currency.id === currencies.find(c => c.default).id ? 0 : 2,
			useGrouping: 'always',
		});
}

export async function fetchPrices()
{
	const response = await fetch('https://windmil.sys.aien.me/api/w/playground/jobs/run_wait_result/p/f/public_services/live_prices?token=M3Nsa4RzxguOuezlXLaMAU6DDX1Ny2');

	if (!response.ok)
	{
		throw new Error('Network response was not ok');
	}

	return response.json();
}