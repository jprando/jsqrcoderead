const path = require('path')
const QrCode = require('qrcode-reader')
const Jimp = require('jimp')

const fileName = path.join(__dirname, 'original.jpg')

var qr = new QrCode()
qr.callback = function (err, value) {
  if (err) {
    console.error(err)
    // TODO handle error
  } else {
    console.log(value.result)
    console.log(value)
  }
}

Jimp.read(fileName, (err, image) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  // image.blur(1) // rapido e menos preciso
  image.gaussian(1) // lento e mais preciso
  /// opcional
  image.write(path.join(__dirname, 'original.out.jpg'))

  qr.decode(image.bitmap)
})
