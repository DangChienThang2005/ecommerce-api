const express = require("express");

const {
  getAllUsers,
  getUserById
} = require("../controllers/userController");

const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authenticateToken, getAllUsers);
router.get("/:id", authenticateToken, getUserById);

module.exports = router;