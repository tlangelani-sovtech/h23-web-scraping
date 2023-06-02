const express = require('express');
const app = express();
require('dotenv').config();
const PORT = process.env.PORT;
const _ = require('lodash');
const puppeteer = require('puppeteer');
const cors = require('cors');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

let browser;
let page;

async function shopriteWebScraper(barcode) {
    console.log('Scraping Shoprite');
    // const browser = await puppeteer.launch({});
    page = await browser.newPage();
 
    await page.goto(`https://www.shoprite.co.za/search/all?q=${barcode}`);
    
    const product = await page.waitForSelector('.product-frame', {
        visible: true
    });
    let productURL = await page.evaluate(product => product.querySelector('.product-listening-click').href, product);
    const productList = await page.waitForSelector('.productListJSON');
    const list = await page.evaluate(l => l.textContent, productList);
    
    // browser.close();

    return {
        productURL,
        data: JSON.parse(list),
    }
};

async function checkersWebScraper(barcode) {
    console.log('Scraping Checkers');
    // const browser = await puppeteer.launch({});
    page = await browser.newPage();
 
    await page.goto(`https://www.checkers.co.za/search/all?q=${barcode}`);
    
    const product = await page.waitForSelector('.product-frame', {
        timeout: '50000',
        visible: true
    });
    let productURL = await page.evaluate(product => product.querySelector('.product-listening-click').href, product);
    const productList = await page.waitForSelector('.productListJSON');
    const list = await page.evaluate(l => l.textContent, productList);
    
    // browser.close();

    return {
        productURL,
        data: JSON.parse(list),
    }
};

async function pnpWebScraper(title) {
    console.log('Scraping PNP');
    // const browser = await puppeteer.launch({});
    page = await browser.newPage();
 
    await page.goto(`https://www.pnp.co.za/pnpstorefront/pnp/en/search/?text=${title}`);
    
    const product = await page.waitForSelector('.product-card-grid');
    let productURL = await page.evaluate(product => product.querySelector('.js-potential-impression-click').href, product);
    let productName = await page.evaluate(product => product.querySelector('.item-name').textContent, product);
    let productPrice = await page.evaluate(product => product.querySelector('.currentPrice  ').textContent, product);
    
    // browser.close();

    return {
        productURL,
        productName,
        productPrice: productPrice.replace('\n\t\t\t', ''),
    }
};

app.post('/search', async (req, res) => {
    const { barcode, title } = req.body;

    browser = await puppeteer.launch({});

    if (_.isEmpty(barcode)) {
        return res.status(400).json({
            success: false,
            message: 'Please provide barcode'
        });
    }

    const shopriteResult = await shopriteWebScraper(barcode);
    // const checkersResult = await checkersWebScraper(barcode);
    let pnpResult = [];
    if (!_.isEmpty(title)) {
        pnpResult = await pnpWebScraper(title);
    }

    browser.close();

    return res.status(200).json({
        success: true,
        message: 'SmartSaver+',
        data: {
            shoprite: shopriteResult,
            // checkers: checkersResult,
            pnp: pnpResult,
        }
    });
});

app.listen(PORT, () => console.log(`Express server running on port ${PORT}`));
