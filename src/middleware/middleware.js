// middleware.js

const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const authMiddleware = async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ error: "Token tidak valid" });
  }

  try {
    // Verifikasi token
    const decoded = jwt.verify(token, "secret_key");

    // Cari pengguna berdasarkan ID
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      return res.status(401).json({ error: "Pengguna tidak valid" });
    }

    // Tambahkan objek pengguna ke objek permintaan (req)
    req.user = user;

    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: "Token tidak valid" });
  }
};

module.exports = authMiddleware;
