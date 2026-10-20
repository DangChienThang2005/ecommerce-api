require("dotenv").config();

const express = require("express");
const cors = require("cors");
const prisma = require("./src/utils/prisma");
const roleRoutes = require("./src/routes/roleRoutes");
const membershipRoutes = require("./src/routes/membershipRoutes");
const authRoutes = require("./src/routes/authRoutes");
const userRoutes = require("./src/routes/userRoutes");
const productRoutes = require("./src/routes/productRoutes");
const orderRoutes = require("./src/routes/orderRoutes");
const shipmentRoutes = require("./src/routes/shipmentRoutes");


const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/roles", roleRoutes);
app.use("/api/memberships", membershipRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/shipments", shipmentRoutes);


// Health check
app.get("/health", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    res.status(200).json({
      status: "OK",
      message: "API and database are healthy"
    });
  } catch (error) {
    res.status(500).json({
      status: "ERROR",
      message: "Database connection failed"
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});