// index.js
const express = require('express')
const rp = require('request-promise')
const cheerio = require('cheerio')

const scrape = require('./src/scraping/scrape')

const app = express()
const PORT = 4000


app.listen(PORT, () => {
  console.log(`API listening on PORT ${PORT} `)
})

app.get('/', (req, res) => {
  res.send('Hey this is my API running 🥳')
})

app.get('/about', (req, res) => {
  res.send('This is my about route..... ')
})

app.get('/programero-last-post', async (req, res) => {
  console.log('programero-last-post');

  const sr = new scrape(rp, cheerio);
  await sr.getInfo()
    .then(info => {
      res.status(info.status);
      res.send(info.data);
    })
    ;
  
  
})


// Export the Express API
module.exports = app
