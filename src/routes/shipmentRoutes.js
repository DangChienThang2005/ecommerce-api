const express = require("express");

const {
  createShipment,
  getAllShipments,
  getShipmentById,
  updateShipment,
  deleteShipment
} = require("../controllers/shipmentController");

const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authenticateToken, getAllShipments);
router.get("/:id", authenticateToken, getShipmentById);
router.post("/", authenticateToken, createShipment);
router.put("/:id", authenticateToken, updateShipment);
router.delete("/:id", authenticateToken, deleteShipment);

module.exports = router;