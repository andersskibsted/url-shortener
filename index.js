require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const dns = require('dns');
const validUrl = require('valid-url');

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

let urlShortened = {};
let numberOfUrls = 0;

function stripHTTPS(url) {
  // Remove http:// or https:// if present
  return url.replace(/^https?:\/\//, '');
}

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});

app.post('/api/shorturl', (req, res) => {
  const originalUrl = req.body.url;

  if (validUrl.isWebUri(originalUrl)) {
    numberOfUrls++;
    urlShortened[numberOfUrls] = originalUrl;
    res.json({ 'original_url': originalUrl, 'short_url': numberOfUrls });
  } else {
    res.json({ 'error': 'invalid url' });
  }
  
});

app.get('/api/shorturl/:number', (req, res) => {
  const redirectUrl = urlShortened[req.params.number];
  res.redirect(redirectUrl);

})

