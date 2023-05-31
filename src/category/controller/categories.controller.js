const { PrismaClient } = require('@prisma/client')

const dbService = new PrismaClient()

class CategoriesController {

    async createCategories(req, res) {
        const { name } = req.body
        try {
            const existingCategory = await dbService.categories.findFirst({
                where: {
                    name: name,
                },
            });

            if (existingCategory) {
                return res.status(400).json({ error: 'Category name already exists' });
            }
            const categories = await dbService.categories.create({
                data: {
                    name
                }
            })
            res.status(200).json(categories)
        } catch (error) {
            res.status(400).json({
                error: 'An Error Occurred While Creating Data Categories',
                status: 400
            })
        }
    }

    async findAllCategories(req, res) {
        try {
            const categories = await dbService.categories.findMany()
            res.status(200).json(categories)
        } catch (error) {
            res.status(400).json({
                error: 'An Error Occurred While Retrieving Data Categories',
                status: 400
            })
        }
    }

    async findOneCategories(req, res) {
        const { id } = req.params

        try {
            const categories = await dbService.categories.findFirst({
                where: {
                    id: parseInt(id)
                }
            })
            if (categories) {
                res.status(200).json(categories)
            } else {
                res.status(404).json({
                    error: 'Categories not found',
                    status: 404,
                });
            }

        } catch (error) {
            res.status(400).json({
                error: 'An Error Occurred While Retrieving Data Categories',
                status: 400
            })
        }
    }

    async updateCategories(req, res) {
        const { id } = req.params
        const { name } = req.body
        try {
            const categories = await dbService.categories.update({
                where: {
                    id: parseInt(id)
                },
                data: {
                    name: name
                }
            })
            if (categories) {
                res.status(200).json(categories)
            } else {
                res.status(400).json({
                    error: 'Categories Not Found',
                    status: 400
                })
            }
            const existingCategory = await dbService.categories.findFirst({
                where: {
                    name: name,
                },
            });

            if (existingCategory) {
                return res.status(400).json({ error: 'Category name already exists' });
            }

        } catch (error) {
            res.status(400).json({
                error: 'An Error Occurred While Updating Categories',
                status: 400
            })

        }
    }

    async deleteCategories(req, res) {
        const { id } = req.params
        try {
            const categories = await dbService.categories.delete({
                where: {
                    id: parseInt(id)
                }
            })
            if (categories) {
                res.status(200).json(categories)
            } else {
                res.status(400).json({
                    error: 'Categories Not Found',
                    status: 400
                })
            }
        } catch (error) {
            res.status(400).json({
                error: 'An Error Occurred While Deleting Categories',
                status: 400
            })
        }
    }

    async findBooksCategory(req, res) {
        const { id } = req.params
        try {
            const product = await dbService.books.findMany({
                where: {
                    categories: {
                        some: {
                            categoryId: parseInt(id)
                        }
                    }
                },
                include: {
                    categories: true
                }
            })
            res.json(product)
        } catch (error) {
            res.status(400).json({
                error: 'An Error Occurred While Fetching Product Category',
                status: 400
                })
        }
    }

}

module.exports = CategoriesController