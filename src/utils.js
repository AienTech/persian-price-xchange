export const DEFAULT_CURRENCY = 'toman';
export const DEFAULT_CURRENCY_NAME = 'تومان';

export const registeredKeys = {
	price_dollar_dt: {
		name: 'دلار',
		type: 'USD'
	},
	price_eur: {
		name: 'یورو',
		type: 'EUR'
	},
	price_try: {
		name: 'لیر',
		type: 'TRY'
	},
	price_aed: {
		name: 'درهم امارات',
		type: 'AED'
	},
	[DEFAULT_CURRENCY]: {
		name: DEFAULT_CURRENCY_NAME,
		id: 'toman'
	}
};


export const transformPrices = (prices) =>
{
	const priceList = Object.keys(prices)
		.filter(k => Object.keys(registeredKeys).includes(k))
		.map(k =>
		{
			const amount = parseInt(prices[k].p?.replace(",", "") || "0") / 10;

			return {
				...registeredKeys[k],
				id: k,
				amount,
			};
		});

	priceList.push({
		id: 'toman',
		name: registeredKeys.toman.name,
		amount: 1
	});

	return priceList;
};

export function getExchangeRate(c1, c2, currencies)
{
	const currency1 = currencies.find(currency => currency.id === c1);
	const currency2 = currencies.find(currency => currency.id === c2);

	if (!currency1 || !currency2)
	{
		throw new Error('invalid currency IDs provided');
	}

	return currency1.amount / currency2.amount;
}