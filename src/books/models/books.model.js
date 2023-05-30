const { PrismaClient } = require('@prisma/client')

const dbService = new PrismaClient()

class BookModel {
    async findAll() {
        return dbService.books.findMany()
    }

    async findOne(id) {
        return dbService.books.findFirst({
            where: {
                id: parseInt(id)
            }
        })
    }

    async create(data) {
        return dbService.books.create({
            data
        })
    }

    async update(id, data){
        return dbService.books.update({
            where: {
                id: parseInt(id)
            },
            data
        })
    }

    async delete(id){
        return dbService.books.delete({
            where : {
                id: parseInt(id)
            }
        })
    }
}

module.exports = BookModel