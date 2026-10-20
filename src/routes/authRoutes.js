const express = require("express");
const {
  register,
  login
} = require("../controllers/authController");
const router = express.Router();
const authenticateToken = require("../middleware/authMiddleware");

router.post("/register", register);
router.post("/login", login);
router.get("/profile", authenticateToken, (req, res) => {
  res.status(200).json({
    message: "Protected route accessed successfully",
    user: req.user
  });
});


module.exports = router;