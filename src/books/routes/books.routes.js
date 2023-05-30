const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const BookController = require('../controller/books.controller');

const diskStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../../images"));
  },
  filename: function (req, file, cb) {
    cb(
      null,
      Date.now() + path.extname(file.originalname)
    );
  },
});
const upload = multer({ storage: diskStorage });

const bookController = new BookController();

router.get('/show', bookController.getAllBooks);
router.get('/show/:id', bookController.getOneBooks);
router.post('/create', upload.single('image'), bookController.createBook);
router.patch('/update/:id', bookController.updateBook);
router.delete('/delete/:id', bookController.deleteBook);

module.exports = router;
