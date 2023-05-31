const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const mime = require('mime-types')
const BookController = require('../controller/books.controller');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      if (file.mimetype === 'application/pdf') {
        cb(null, path.join(__dirname, '../../pdfs'));
      } else if (
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpeg' ||
        file.mimetype === 'image/jpg'
      ) {
        cb(null, path.join(__dirname, '../../images'));
      } else {
        cb(new Error('Invalid file type.'));
      }
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '.' + mime.extension(file.mimetype));
    },
  });

const upload = multer({ storage: storage });
const bookController = new BookController();

router.get('/show', bookController.getAllBooks);
router.get('/show/:id', bookController.getOneBooks);
router.post('/create', upload.fields([
    {name: 'image', maxCount: 1},
    {name: 'file', maxCount: 1}
]), bookController.createBook);
router.patch('/update/:id', upload.fields([
    {name: 'image', maxCount: 1},
    {name: 'file', maxCount: 1}
]), bookController.updateBook);
router.delete('/delete/:id', bookController.deleteBook);
router.get('/download/:id', bookController.downloadBook);
router.get('/the-best-books', bookController.bestBooks)

module.exports = router;
