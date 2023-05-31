<<<<<<< HEAD
const express = require("express");
const bookRoutes = require("./src/books/routes/books.routes");
const userRoutes = require("./src/users/routes/users.routes");
const authRoutes = require("./src/users/controller/user.controller");
const { PrismaClient } = require("@prisma/client");
=======
const express = require('express');
const bookRoutes = require('./src/books/routes/books.routes');
const categoriesRoutes = require('./src/category/routes/categories.routes')
const { PrismaClient } = require('@prisma/client');



>>>>>>> 88b995ec33f15b206fa0f0d54cf4c2148b6d9a9e

const dbService = new PrismaClient();
const app = express();
app.use(express.json());
<<<<<<< HEAD
app.use("/books", bookRoutes);
app.use("/users", userRoutes);
// Menggunakan rute autentikasi
app.use("/auth", authRoutes);
=======
app.use('/books', bookRoutes);
app.use('/categories', categoriesRoutes)
>>>>>>> 88b995ec33f15b206fa0f0d54cf4c2148b6d9a9e

// Menggunakan rute yang dilindungi
async function runPrisma() {
  await dbService.$connect();
  await dbService.$queryRaw`SELECT 1 + 1`;
  await dbService.$disconnect();
}

runPrisma().catch((error) => {
  console.error("Terjadi kesalahan saat menjalankan migrasi", error);
  process.exit(1);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server berjalan pada PORT ${PORT}`);
});
