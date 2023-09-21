const express = require('express');
const bodyParser = require('body-parser');
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
        browser = await puppeteer.connect({
            browserWSEndpoint: `wss://chrome.browserless.io?token=${process.env.BLESS_TOKEN}`,
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
