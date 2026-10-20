const prisma = require("../utils/prisma");

// GET /api/products
const getAllProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany();

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({
      message: "Failed to get products"
    });
  }
};

// GET /api/products/:id
const getProductById = async (req, res) => {
  try {
    const pid = Number(req.params.id);

    const product = await prisma.product.findUnique({
      where: { pid }
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({
      message: "Failed to get product"
    });
  }
};

// POST /api/products
const createProduct = async (req, res) => {
  try {
    const { pname, price, quantity } = req.body;

    if (!pname || price === undefined || quantity === undefined) {
      return res.status(400).json({
        message: "pname, price and quantity are required"
      });
    }

    if (Number(price) < 0 || Number(quantity) < 0) {
      return res.status(400).json({
        message: "price and quantity must be greater than or equal to 0"
      });
    }

    const product = await prisma.product.create({
      data: {
        pname,
        price,
        quantity: Number(quantity)
      }
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({
      message: "Failed to create product"
    });
  }
};

// PUT /api/products/:id
const updateProduct = async (req, res) => {
  try {
    const pid = Number(req.params.id);
    const { pname, price, quantity } = req.body;

    if (!pname || price === undefined || quantity === undefined) {
      return res.status(400).json({
        message: "pname, price and quantity are required"
      });
    }

    if (Number(price) < 0 || Number(quantity) < 0) {
      return res.status(400).json({
        message: "price and quantity must be greater than or equal to 0"
      });
    }

    const existingProduct = await prisma.product.findUnique({
      where: { pid }
    });

    if (!existingProduct) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    const product = await prisma.product.update({
      where: { pid },
      data: {
        pname,
        price,
        quantity: Number(quantity)
      }
    });

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({
      message: "Failed to update product"
    });
  }
};

// DELETE /api/products/:id
const deleteProduct = async (req, res) => {
  try {
    const pid = Number(req.params.id);

    const existingProduct = await prisma.product.findUnique({
      where: { pid }
    });

    if (!existingProduct) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    await prisma.product.delete({
      where: { pid }
    });

    res.status(200).json({
      message: "Product deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete product"
    });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};