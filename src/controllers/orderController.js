const prisma = require("../utils/prisma");

// POST /api/orders
const createOrder = async (req, res) => {
  try {
    const uid = req.user.uid;
    const { items } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        message: "Order must contain at least one product"
      });
    }

    for (const item of items) {
      if (!item.pid || !Number.isInteger(Number(item.qty)) || Number(item.qty) <= 0) {
        return res.status(400).json({
          message: "Each item must have a valid pid and qty greater than 0"
        });
      }
    }

    const result = await prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          uid
        }
      });

      for (const item of items) {
        const pid = Number(item.pid);
        const qty = Number(item.qty);

        const product = await tx.product.findUnique({
          where: { pid }
        });

        if (!product) {
          throw new Error(`PRODUCT_NOT_FOUND:${pid}`);
        }

        if (product.quantity < qty) {
          throw new Error(`INSUFFICIENT_STOCK:${pid}`);
        }

        await tx.orderDetail.create({
          data: {
            oid: order.oid,
            pid,
            qty,

            // Không lấy giá từ client.
            // Lưu giá hiện tại của Product tại thời điểm đặt hàng.
            unit_price: product.price
          }
        });

        await tx.product.update({
          where: { pid },
          data: {
            quantity: {
              decrement: qty
            }
          }
        });
      }

      return tx.order.findUnique({
        where: {
          oid: order.oid
        },
        include: {
          user: {
            select: {
              uid: true,
              username: true,
              fullname: true
            }
          },
          orderDetails: {
            include: {
              product: true
            }
          }
        }
      });
    });

    res.status(201).json(result);
  } catch (error) {
    if (error.message.startsWith("PRODUCT_NOT_FOUND:")) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    if (error.message.startsWith("INSUFFICIENT_STOCK:")) {
      return res.status(400).json({
        message: "Insufficient product stock"
      });
    }

    res.status(500).json({
      message: "Failed to create order"
    });
  }
};

// GET /api/orders
const getMyOrders = async (req, res) => {
  try {
    const uid = req.user.uid;

    const orders = await prisma.order.findMany({
      where: {
        uid
      },
      include: {
        orderDetails: {
          include: {
            product: true
          }
        },
        shipments: true
      },
      orderBy: {
        oid: "desc"
      }
    });

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({
      message: "Failed to get orders"
    });
  }
};

// GET /api/orders/:id
const getOrderById = async (req, res) => {
  try {
    const oid = Number(req.params.id);
    const uid = req.user.uid;

    const order = await prisma.order.findFirst({
      where: {
        oid,
        uid
      },
      include: {
        orderDetails: {
          include: {
            product: true
          }
        },
        shipments: true
      }
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found"
      });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({
      message: "Failed to get order"
    });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById
};