require('dotenv').config();
const express = require('express');
const cors = require('cors');

const dns = require('dns');
const url = require('url');
const bodyParser = require('body-parser');
const { hostname } = require('os');

const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function (req, res) {
  res.json({ greeting: 'hello API' });
});

let urlDataBase = {};
let urlCounter = 1;

// Ruta para acortar una URL
app.post('/api/shorturl', (req, res) => {
  const originalUrl = req.body.url;

  const urlPattern = /^(http|https):\/\/[^ "]+$/;
  if (!urlPattern.text(originalUrl)) {
    return res.json({ error: 'invalid url' });
  }

  dns.lookup(hostname, (err, addesses) => {
    if (err) {
      return res.json({ error: 'invalid url' });
    }

    const shortUrl = urlCounter++;
    urlDataBase[shortUrl] = originalUrl;

    res.json({
      original_url: originalUrl,
      short_url: shortUrl
    });

  });

});

app.get('/api/shorturl/:shorUrl', (req, res) => {
  const shortUrl = req.params.shorUrl;
  const originalUrl = urlDataBase[shortUrl];

  if (orignalUrl) {
    res.redirect(originalUrl);
  } else {
    res.json({ error: 'No URL found' });
  }
});


app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
