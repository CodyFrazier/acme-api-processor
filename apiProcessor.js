const grabData = (target) => new Promise((res, rej) => {
	// can change url to /api/products, /api/offerings for the other ones
    return window.fetch(`https://acme-users-api-rev.herokuapp.com/api/${ target }`)
	.then(response => response.json())
	.then(jsonData => res(jsonData))
	.catch(e => rej(e));
});

const productsInPriceRange = (products, rangeObj) => {
	return Object.keys(products).map(item => { //It seems Object.keys isn't actually useable here.
		console.log('item:', item);
		if(products[item].price > rangeObj.min && products[item].price < rangeObj.max){
			return item;
		} 
	});
}

const companies = grabData('companies').then(company => {return company});
const products = grabData('products').then(product => {return product});
const offerings = grabData('offerings').then(offer => {return offer});

console.log('products.then:', products.then(productsInPriceRange(products, { min : 4, max : 6 }))); //just displays all products.