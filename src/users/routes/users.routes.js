// user.js

const express = require("express");
const { PrismaClient } = require("@prisma/client");
const authMiddleware = require("../../middleware/middleware");

const prisma = new PrismaClient();
const router = express.Router();

router.get("/profile", authMiddleware, async (req, res) => {
  try {
    // Mendapatkan data pengguna dari objek permintaan (req)
    const user = req.user;

    res.json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Terjadi kesalahan server" });
  }
});

module.exports = router;
