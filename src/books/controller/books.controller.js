const { PrismaClient } = require('@prisma/client')
const fs = require('fs')
const path = require('path')


const dbService = new PrismaClient()


class BookController {
    async getAllBooks(req, res) {
        try {
            const books = await dbService.books.findMany()
            res.json(books)
        } catch (error) {
            console.error('Error Ges', error)
            res.status(500).json({ error: 'Error Ges' })
        }
    }

    async getOneBooks(req, res) {
        const { id } = req.params
        try {
            const books = await dbService.books.findFirst({
                where: {
                    id: parseInt(id)
                }
            })
            if (!books) {
                return res.json(404).json({ error: 'Tidak Ada Buku Tersebut ' })
            }
            res.json(books)
        } catch (error) {
            res.status(500).json({ error: 'Terjadi kesalahan saat mengambil data buku' });
        }
    }

    async createBook(req, res) {
        const { name, author, description, status, categories } = req.body 
        if (!req.files || !req.files['image'] || !req.files['file']) {
            return res.status(400).json({ message: 'File image and file are required' });
        }
        try {
            const existingBook = await dbService.books.findUnique({
                where: {
                    name: name
                }
            })

            if (existingBook) {
                return res.json({
                    error: 'Nama Buku Telah Tersedia'
                })
            }
            const image = req.files['image'][0].filename
            const file = req.files['file'][0].filename
            const newBook =  { name, author, description, status, image, file}
            const books = await dbService.books.create({ 
                data: { 
                    ...newBook,
                    categories: {
                        create: categories.map((category) => {
                            return {
                                category: {
                                    connect: {
                                        id: parseInt(category)
                                    }
                                }
                            }
                        })
                    }
                    
                },
                include: {
                    categories: true
                }
                 
            })
            res.json(books)
        } catch (error) {
            console.error('Terjadi kesalahan saat menambahkan buku:', error);
            res.status(500).json({ error: 'Terjadi kesalahan saat menambahkan buku' });
        }
    }

    async updateBook(req, res) {
        const { name, author, description, status } = req.body
        const { id } = req.params
        try {
            const books = await dbService.books.update({ where: { id: parseInt(id) }, data: { name, author, description, status, image: req.file.filename } })
            res.json(books)
        } catch (error) {
            res.status(500).json({ error: 'Terjadi kesalahan saat update buku' });
        }
    }

    async deleteBook(req, res) {
        const { id } = req.params
        try {
            const books = await dbService.books.delete({
                where: {
                    id: parseInt(id)
                }
            })
            res.json(books)
        } catch (error) {
            res.status(500).json({ error: 'Terjadi kesalahan saat menghapus buku' });
        }
    }

    async downloadBook(req, res) {
        const { id } = req.params;
        try {

            const book = await dbService.books.findUnique({
                where: {
                    id: parseInt(id),
                },
            });

           


            if (!book) {
                return res.status(404).json({ error: 'Buku tidak ditemukan' });
            }

            const filePath = path.join(__dirname, '../../pdfs', book.file);

            const stat = fs.statSync(filePath);
            const fileSize = stat.size;
            const range = req.headers.range;

            if (range) {

                const parts = range.replace(/bytes=/, '').split('-');
                const start = parseInt(parts[0], 10);
                const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
                const chunksize = end - start + 1;
                const file = fs.createReadStream(filePath, { start, end });
                const head = {
                    'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                    'Accept-Ranges': 'bytes',
                    'Content-Length': chunksize,
                    'Content-Type': 'application/pdf',
                };
                res.writeHead(206, head);
                file.pipe(res);
            } else {
                const head = {
                    'Content-Length': fileSize,
                    'Content-Type': 'application/pdf',
                };
                res.writeHead(200, head);
                fs.createReadStream(filePath).pipe(res);
            }

            const updateBook = book.popularity + 1

            await dbService.books.update({
                where :{
                    id: parseInt(id)
                },
                data : {
                    popularity: updateBook
                }
            })
        } catch (error) {
            console.error('Terjadi kesalahan saat mengambil data buku:', error);
            res.status(500).json({ error: 'Terjadi kesalahan saat mengambil data buku' });
        }
    }

    async bestBooks(req, res) {
        try{
            const books = await dbService.books.findMany()
            const booksPopularity = books.map((book) => ({
                ...book,
                popularity: book.popularity
                }))
            
                const booksPopularitySorted = booksPopularity.sort((a, b) => b.popularity - a.popularity)
                const booksPopularityLimit = booksPopularitySorted.slice(0, 3)
                res.json(booksPopularityLimit)

        }catch(error){
            res.status(500).json({ 
                error: 'Terjadi kesalahan saat mengambil data buku',
                status: 400
            });
        }
    }
}

module.exports = BookController