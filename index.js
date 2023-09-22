const express = require('express');
const bodyParser = require('body-parser');
const puppeteer = require('puppeteer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(bodyParser.json());

app.get('/get-title', async (req, res) => {
    const url = req.query.url;

    if (!url) {
        return res.status(400).send({ error: 'URL parameter is required' });
    }


    let browser = null;

    try {
          const browser = await puppeteer.launch({
            args: [
              "--disable-setuid-sandbox",
              "--no-sandbox",
              "--single-process",
              "--no-zygote",
            ],
            executablePath:
              process.env.NODE_ENV === "production"
                ? process.env.PUPPETEER_EXECUTABLE_PATH
                : puppeteer.executablePath(),
            headless: "new"
          });
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'domcontentloaded' }); // networkidle0, load, domcontentloaded
        const title = await page.title();
        res.send({ title });
    } catch (error) {
        console.log(error);
        res.status(500).send({ error: 'Failed to fetch the website title' });
    } finally {
        if (browser) {
            await browser.close();
        }
    }
});


app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});
