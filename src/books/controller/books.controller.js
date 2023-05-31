const BookModel = require("../models/books.model");
const { PrismaClient } = require("@prisma/client");
const bookModel = new BookModel();

const dbService = new PrismaClient();

class BookController {
  async getAllBooks(req, res) {
    try {
      const books = await bookModel.findAll();
      res.json(books);
    } catch (error) {
      console.error("Error Ges", error);
      res.status(500).json({ error: "Error Ges" });
    }
  }

  async getOneBooks(req, res) {
    const { id } = req.params;
    try {
      const books = await bookModel.findFirst(id);
      if (!books) {
        return res.json(404).json({ error: "Tidak Ada Buku Tersebut " });
      }
      res.json(books);
    } catch (error) {
      res
        .status(500)
        .json({ error: "Terjadi kesalahan saat mengambil data buku" });
    }
  }

  async createBook(req, res) {
    const { name, author, description, status } = req.body;

    try {
      const books = await dbService.books.create({
        data: { name, author, description, status, image: req.file.filename },
      });
      res.json(books);
    } catch (error) {
      console.error("Terjadi kesalahan saat menambahkan buku:", error);
      res
        .status(500)
        .json({ error: "Terjadi kesalahan saat menambahkan buku" });
    }
  }

  async updateBook(req, res) {
    const { name, author, description, image, price, status } = req.body;
    const { id } = req.params;
    try {
      const books = await bookModel.update.update(id, {
        name,
        author,
        description,
        image,
        price,
        status,
      });
      res.json(books);
    } catch (error) {
      res.status(500).json({ error: "Terjadi kesalahan saat update buku" });
    }
  }

  async deleteBook(req, res) {
    const { id } = req.params;
    try {
      const books = await bookModel.delete(id);
      res.json(books);
    } catch (error) {
      res.status(500).json({ error: "Terjadi kesalahan saat menghapus buku" });
    }
  }
}

module.exports = BookController;
