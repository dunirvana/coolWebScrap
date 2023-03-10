module.exports = class Scrape {

  constructor(rp, cheerio, urlToScrape) {

    this.rp = rp;
    this.cheerio = cheerio;
    
    this.options = {
      uri: urlToScrape,
      transform: function (body) {
    
        return cheerio.load(body)
      }
    };
  
  }
  
  async getInfo(elementInfo){
    
    let response = {};

    await this.rp(this.options)
      .then(($) => {
  
        // Find element
        const divsWithClass = $(elementInfo);
  
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
