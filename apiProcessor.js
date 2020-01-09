async function main(){
	const grabData = (target) => new Promise((res, rej) => {
		// can change url to /api/products, /api/offerings for the other ones
		return window.fetch(`https://acme-users-api-rev.herokuapp.com/api/${ target }`)
		.then(response => response.json())
		.then(jsonData => {return res( jsonData.map(item => {return item}))})
		.catch(e => rej(e));
	});

	const loadData = async() => {
		return [productsArr, companiesArr, offeringsArr] = await Promise.all([
			grabData('products'),
			grabData('companies'),
			grabData('offerings')
		]);
	}

	const getProductsInPriceRange = (products, rangeObj) => {
		return products.filter(product => {
			if(product.suggestedPrice >= rangeObj.min && product.suggestedPrice <= rangeObj.max){
				return product;
			}
		});
	}

	const groupCompaniesByLetter = (companies) => { 
		const letters = ['a','b', 'c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z']
		return letters.reduce((acc, letter) => {
			acc.push( companies.filter(company => {
				return company.name.substr(0, 1).toLowerCase() === letter;
			}));
			return acc;
		}, []);
	}

	const groupCompaniesByState = (companies) => {
		
		const states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Conneticut', 'Delaware', 'Florida',
		'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland',
		'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
		'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania',
		'Rhode Island', 'South Carolina', 'South Dakota', 'Tennesee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington',
		'West Virginia', 'Wisconsin', 'Wyoming'];
		
		return states.reduce((acc, state) => {
			acc.push( companies.filter(company => {
				return company.state.toLowerCase() === state.toLowerCase();
			}));
			return acc;
		}, []);
	}

	const processOffers = ({ companies, products, offerings }) => {
		return offerings.reduce((acc, offer) => {
			const company = companies.filter(comp => {
				return comp.id === offer.companyId;
			});
			const product = products.filter(prod => {
				return prod.id === offer.productId;
			});
			acc.push({ 'offer' : offer, 'company' : company, 'product' : product });
			return acc;
		}, []);
	}

	const getCompaniesByNumberOfOfferings = (companies, offerings, num) => {
		return companies.filter(company => {
			const companyOffers = offerings.filter(offer => {
				return offer.companyId === company.id;
			});
			return companyOffers.length >= num;
		});
	}

	const processProducts = ({ products, offerings }) => {
		return products.map(product => {
			const averagePriceArr = offerings.filter(offer => {
				return offer.productId === product.id;
			}).reduce((acc, offer) => {
				acc.push(offer.price);
				return acc;
			}, []);
			return {'product' : product, 'averagePrice' : averagePriceArr.reduce((acc, price) => {
				return acc += price; }, 0) / averagePriceArr.length }
		});
	}

	//Console log any of these to check that the above function work.
	const [products, companies, offerings] = await loadData();
	const companiesByLetter = groupCompaniesByLetter(companies);
	const productsInPriceRange = getProductsInPriceRange(products, { min : 4, max : 6 });
	const companiesByState = groupCompaniesByState(companies);
	const processedOffers = processOffers({ 'companies' : companies, 'products' : products, 'offerings' : offerings });
	const companiesWithThreeOffers = getCompaniesByNumberOfOfferings(companies, offerings, 3);
	const processedProducts = processProducts({'products' : products, 'offerings' : offerings });
}

main();