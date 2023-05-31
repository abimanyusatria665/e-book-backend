const express = require('express');
const bookRoutes = require('./src/books/routes/books.routes');
const categoriesRoutes = require('./src/category/routes/categories.routes')
const { PrismaClient } = require('@prisma/client');




const dbService = new PrismaClient();
const app = express();
app.use(express.json());
app.use('/books', bookRoutes);
app.use('/categories', categoriesRoutes)

async function runPrisma() {
  await dbService.$connect();
  await dbService.$queryRaw`SELECT 1 + 1`;
  await dbService.$disconnect();
}

runPrisma().catch((error) => {
  console.error('Terjadi kesalahan saat menjalankan migrasi', error);
  process.exit(1);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server berjalan pada PORT ${PORT}`);
});
