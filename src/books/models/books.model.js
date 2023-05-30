import { PrismaClient } from '@prisma/client'

const dbService = new PrismaClient()

class BookModel {
    async findAll(){
        return dbService.Books.findAll()
    }


}