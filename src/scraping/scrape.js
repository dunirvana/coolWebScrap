module.exports = class Scrape {

  constructor(rp, cheerio) {

    this.rp = rp;
    this.cheerio = cheerio;
    
    this.options = {
      uri: 'https://programero.blogspot.com/',
      transform: function (body) {
    
        return cheerio.load(body)
      }
    };
  
  }
  
  async getInfo(){
    
    let response = {};

    await this.rp(this.options)
      .then(($) => {
  
        // Find element
        const divsWithClass = $('div.big-post-title-inner h3.post-title');
  
        // Iterate over element
        divsWithClass.each((i, div) => {
          response = {
            status: 200,
            data: {
              message: $(div).text(),
              url: $('a', div).attr('href')
            }
          };
        });

      })
      .catch((err) => {        
        console.error(err);

        response = { status: 500, data: { message: 'Error on scraping'}};
      })  

      return response;
  }
  
};
