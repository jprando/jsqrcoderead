const path = require('path')
const QrCode = require('qrcode-reader')
const Jimp = require('jimp')

const fileName = path.join(__dirname, 'original.jpg')
var qr = new QrCode()

const qrcoderead = (efeito, nivel) => new Promise(async function (resolve) {
  await Jimp.read(fileName)
    .then(image => {
      let log = 'n'
      if (efeito && nivel) { log = efeito + nivel }
      if (efeito === 'b') {
        // rapido e menos preciso
        image.blur(nivel)
      } else if (efeito === 'g') {
        // lento e mais preciso
        image.gaussian(nivel)
      }
      /// opcional
      /// image.write(path.join(__dirname, 'original.out.jpg'))
      try {
        let r = qr.process(image.bitmap).result
        if (r) resolve(`${log} ${r}`)
      } catch { }
    })
})
console.log('...')
console.time('.')
Promise.race([
  new Promise((resolve, reject) => setTimeout(reject, 380, 'tempo excedido')),
  qrcoderead(),
  qrcoderead('b', 1),
  /*
  qrcoderead('b', 1.25),
  qrcoderead('b', 1.5),
  qrcoderead('b', 1.75),
  */
  qrcoderead('b', 2),
  qrcoderead('g', 1),
  /*
  qrcoderead('g', 1.25),
  qrcoderead('g', 1.5),
  qrcoderead('g', 1.75),
  */
  qrcoderead('g', 2)
])
  .then(v => console.timeEnd('.') || v)
  .then(v => console.log('# OK', v))
  .catch(err => console.log('# ERRO', err))
  .finally(p => process.exit())
