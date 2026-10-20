const express = require("express");

const {
  getAllMemberships,
  getMembershipById,
  createMembership,
  updateMembership,
  deleteMembership
} = require("../controllers/membershipController");

const router = express.Router();

router.get("/", getAllMemberships);
router.get("/:id", getMembershipById);
router.post("/", createMembership);
router.put("/:id", updateMembership);
router.delete("/:id", deleteMembership);

module.exports = router;