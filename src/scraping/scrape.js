module.exports = class Scrape {

  constructor(rp, cheerio) {
    console.log('new Scrape!');

    this.rp = rp;
    this.cheerio = cheerio;
    
    this.options = {
      uri: 'https://programero.blogspot.com/',
      transform: function (body) {
        //console.log('transform', body);
    
        return cheerio.load(body)
      }
    };
  
  }
  
  async getInfo(){
    console.log('getInfo!');

    
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
              title: $(div).text(),
              url: $('a', div).attr('href')
            }
          };
        });

        console.log('return', response);
      })
      .catch((err) => {        
        console.error(err);

        response = { status: 500, data: { message: 'Error on scraping'}};
      })  

      return response;
  }
  
};
