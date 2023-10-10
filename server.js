const express = require("express");
const bookRoutes = require("./src/books/routes/books.routes");
const userRoutes = require("./src/users/routes/users.routes");
const { PrismaClient } = require("@prisma/client");
const express = require('express');
const categoriesRoutes = require('./src/category/routes/categories.routes')
const { PrismaClient } = require('@prisma/client');




const dbService = new PrismaClient();
const app = express();
app.use(express.json());
app.use("/books", bookRoutes);
app.use("/users", userRoutes);
// Menggunakan rute autentikasi
app.use('/categories', categoriesRoutes)

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
