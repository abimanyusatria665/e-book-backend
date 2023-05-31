const express = require('express')
const router = express.Router()
const CategoriesController = require('../controller/categories.controller')

const categoriesController = new CategoriesController()

router.post('/create', categoriesController.createCategories)
router.get('/show', categoriesController.findAllCategories)
router.get('/show/:id', categoriesController.findOneCategories)
router.patch('/update/:id', categoriesController.updateCategories)
router.delete('/delete/:id', categoriesController.deleteCategories)
router.get('/books/:id', categoriesController.findBooksCategory)

module.exports = router