const puppeteer = require('puppeteer');


async function run(){

	const browser = await puppeteer.launch({ headless: "new" });
	const page = await browser.newPage();
	await page.goto('https://wppool.dev');

	await page.screenshot({ path: 'wppool-fullpage.png', fullPage: true });

	await browser.close();


}


run();