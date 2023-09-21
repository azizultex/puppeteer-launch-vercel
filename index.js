const express = require('express');
const bodyParser = require('body-parser');
const puppeteer = require('puppeteer');

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.get('/get-title', async (req, res) => {
    const url = req.query.url;

    if (!url) {
        return res.status(400).send({ error: 'URL parameter is required' });
    }

    let browser;
    let puppeteer;

    if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
      // running on the Vercel platform.
      browser = require('chrome-aws-lambda');
      puppeteer = require('puppeteer-core');
    } else {
      // running locally.
      puppeteer = require('puppeteer');
    }


    try {
        browser = await puppeteer.launch({
          args: [...browser.args, '--hide-scrollbars', '--disable-web-security'],
          defaultViewport: browser.defaultViewport,
          executablePath: await browser.executablePath,
          headless: true,
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
