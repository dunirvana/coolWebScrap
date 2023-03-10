module.exports = class MakeImage {

  constructor(canvas, loadImage) {
    this.ctx = canvas.getContext('2d');
    this.canvas = canvas;
    this.loadImage = loadImage;
  }

  formatMesssage(message) {
    const limitSize = 70;

    if (message.length > limitSize) {
      return message.substring(0, limitSize) + '...';
    }

    return message;
  }

  async getImage(message, imagePath) {

    message = this.formatMesssage(message);

    this.ctx.font = '15px Arial'
    this.ctx.fillStyle = '#58a6ff';
    this.ctx.fillText(message, 5, 25)
  
    let result = null;

    await this.loadImage(imagePath).then((image) => {
      this.ctx.drawImage(image, 0, 0, 0, 0)
      result = this.canvas.toBuffer('image/png', { compressionLevel: 3, filters: this.canvas.PNG_FILTER_NONE })
    });
    
    return result;
  }
};
