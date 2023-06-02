const puppeteer = require('puppeteer');

// shoprite
async function webScraper(url) {
    const browser = await puppeteer.launch({});
    const page = await browser.newPage();
 
    await page.goto(url);
    
    const product = await page.waitForSelector('.product-frame');
    let productURL = await page.evaluate(product => product.querySelector('.product-listening-click').href, product);
    let obj = await page.evaluate(product => product.dataset, product);
    // var price = await page.waitForSelector(".a-price-whole");
    // var priceText = await page.evaluate(price => price.textContent, price);

    const productList = await page.waitForSelector('.productListJSON');
    const list = await page.evaluate(l => l.textContent, productList);
    
    // console.log("Date: " + getDate());
    // console.log("Product: " + productText);
    // console.log("Price: " + priceText);
    console.log(`Product URL: ${productURL}`);
    console.log(list);
    
    browser.close();
};

const search = 'bioplus';

webScraper(`https://www.shoprite.co.za/search/all?q=${search}`);
