const puppeteer = require('puppeteer');
 
function getDate() {
    let date = new Date();
    let fullDate = date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    return fullDate;
}
 
async function webScraper(url) {
    const browser = await puppeteer.launch({});
    const page = await browser.newPage();
 
    await page.goto(url);
    
    var product = await page.waitForSelector("#productTitle");
    console.log(product);
    var productText = await page.evaluate(product => product.textContent, product);
    console.log(productText);

    // var price = await page.waitForSelector(".a-price-whole");
    // var priceText = await page.evaluate(price => price.textContent, price);
    
    // console.log("Date: " + getDate());
    // console.log("Product: " + productText);
    // console.log("Price: " + priceText);
    
    browser.close();
};
 
webScraper('https://www.amazon.in/dp/B09W9MBS1G/ref=cm_sw_r_apa_i_NWPQ1TXATPCD3XBZ0P7W_0');
