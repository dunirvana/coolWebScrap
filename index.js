// 
const express = require('express')

// scraping
const rp = require('request-promise')
const cheerio = require('cheerio')

// make image
// const { createCanvas, loadImage } = require('canvas') ** this don't work on vercel **
const { createCanvas, loadImage } = require('@napi-rs/canvas')
const canvas = createCanvas(500, 40)

// config
const app = express()
const PORT = 4000

// code 
const scrape = require('./src/scraping/scrape')
const makeImage = require('./src/canvas/makeImage')


/* *** APIs *** */

app.listen(PORT, () => {
  console.log(`API listening on PORT ${PORT} `)
})

/** Show what the api is about  */
app.get('/', (req, res) => {

  let routes = [];
  const ignoredRoutes = ['/'];

  app._router.stack.forEach(function(r){    
    if (r.route && r.route.path && !ignoredRoutes.includes(r.route.path)){    
      routes.push(`<li>${r.route.path}</li>`);
    }
  })

  const content = 
    `
      Hello this is my API to fetch the last post of my blog 🥳 
      <hr> 
      <p>
      The goal here is to scrape the blog to take the last post and offer endpoints to retrieve the title of the last post as an image as well as an endpoint that redirects to that post
      </p>
      <br> 
      <ul>${routes.join('')}</ul>
    `;

  res.send(content)

  // res.send('Hello this is my API to fetch the last post of my blog 🥳 ');
})

/** Method to retrieve the last post */
const getLastPost = async () => {
  const sr = new scrape(rp, cheerio);

  let response = null;

  await sr.getInfo()
    .then(info => {
      response = info;
    });  
  
  return response;
}

/** Endpoint to retrieve last post */
app.get('/programero-last-post', async (req, res) => {

  await getLastPost()  
    .then(info => {
      res.status(info.status);
      res.send(info.data);
    });  
})

/** Endpoint to retrieve an image with the text referring to the title of the last post */
app.get('/programero-last-post-image', async (req, res) => {
  
  await getLastPost()  
    .then(info => {

      const message = info.data.message;

      const mi = new makeImage(canvas, loadImage);
      mi.getImage(message)
        .then(img => {
          res.send(img);
        });      
    });    

})

/** Endpoint to redirect navigation to last post */
// app.get('/programero-last-post-url', async (req, res) => {

//   await getLastPost()  
//     .then(info => {
      
//       res.status(301).redirect(info.data.url)
//     });  
// })


// Export the Express API
module.exports = app
