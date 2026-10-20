const express = require("express");

const {
  createOrder,
  getMyOrders,
  getOrderById
} = require("../controllers/orderController");

const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authenticateToken, createOrder);
router.get("/", authenticateToken, getMyOrders);
router.get("/:id", authenticateToken, getOrderById);

module.exports = router;