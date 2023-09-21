const express = require('express');
const bodyParser = require('body-parser');
const chromium = require('@sparticuz/chromium-min');
const puppeteer = require('puppeteer-core');

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.get('/get-title', async (req, res) => {
    const url = req.query.url;

    if (!url) {
        return res.status(400).send({ error: 'URL parameter is required' });
    }


    let browser = null;

    try {
        browser = await puppeteer.launch({
            args: [...chromium.args, '--hide-scrollbars', '--disable-web-security'],
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath(
              `https://github.com/Sparticuz/chromium/releases/download/v116.0.0/chromium-v116.0.0-pack.tar`
            ),
            headless: chromium.headless,
            ignoreHTTPSErrors: true,
        });
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'domcontentloaded' });
        const title = await page.title();
        res.send({ title });
    } catch (error) {
        res.status(500).send({ error: 'Failed to fetch the website title' });
    } finally {
        if (browser) {
            await browser.close();
        }
    }
});


app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
});
