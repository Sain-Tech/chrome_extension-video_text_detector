var express = require('express');
var router = express.Router();
var multer = require('multer');
const tesseract = require('node-tesseract-ocr')
 
// tesseract config
const config = {
  lang: 'eng',
  oem: 1,
  psm: 3
}

var upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'tmp/uploads/');
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname + '.png');
    }
  }),
});

router.post('/gettext', upload.single('picture'), (req, res) => {
  
  console.log(req.file.path);

  tesseract.recognize(req.file.path, config)
    .then(text => {
      res.send(text);
    })
    .catch(err => {
      res.send("error: " + err);
    });
});

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
