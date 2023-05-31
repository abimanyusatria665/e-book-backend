// auth.js

const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const router = express.Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Cari pengguna berdasarkan username
    const user = await prisma.users.findUnique({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: "Kesalahan Kredensial" });
    }

    // Verifikasi password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Kesalahan Kredensial" });
    }

    // Buat token JWT
    const token = jwt.sign({ userId: user.id }, "secret_key");

    res.json({
      statuscode: 200,
      token,
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Terjadi kesalahan server" });
  }
});

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Periksa apakah pengguna dengan username yang diberikan sudah ada dalam database
    const existingUser = await prisma.users.findUnique({ where: { email } });

    if (existingUser) {
      return res.status(409).json({ error: "Email sudah digunakan" });
    }

    // Enkripsi password sebelum menyimpannya ke database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Buat pengguna baru
    const newUser = await prisma.users.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    res.json({
      statusCode: 200,
      message: "Pendaftaran berhasil",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Terjadi kesalahan server" });
  }
});

router.post("/logout", (req, res) => {
  // Lakukan tindakan logout di sini
  // Misalnya, menghapus token dari tempat penyimpanan di sisi klien
  try {
    delete req.headers["authorization"];
    res.json({ message: "Logout berhasil" });
  } catch (error) {
    console.log(error);
    res.json({
      error,
      statusCode: 500,
      message: "gagal Logout",
    });
  }
});

module.exports = router;
