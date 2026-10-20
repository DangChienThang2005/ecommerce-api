const prisma = require("../utils/prisma");

// POST /api/shipments
const createShipment = async (req, res) => {
  try {
    const { oid, status } = req.body;

    if (!oid || !status) {
      return res.status(400).json({
        message: "oid and status are required"
      });
    }

    const order = await prisma.order.findUnique({
      where: {
        oid: Number(oid)
      }
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found"
      });
    }

    const shipment = await prisma.shipment.create({
      data: {
        oid: Number(oid),
        status
      }
    });

    res.status(201).json(shipment);
  } catch (error) {
    res.status(500).json({
      message: "Failed to create shipment"
    });
  }
};

// GET /api/shipments
const getAllShipments = async (req, res) => {
  try {
    const shipments = await prisma.shipment.findMany({
      include: {
        order: true
      }
    });

    res.status(200).json(shipments);
  } catch (error) {
    res.status(500).json({
      message: "Failed to get shipments"
    });
  }
};

// GET /api/shipments/:id
const getShipmentById = async (req, res) => {
  try {
    const shipid = Number(req.params.id);

    const shipment = await prisma.shipment.findUnique({
      where: {
        shipid
      },
      include: {
        order: true
      }
    });

    if (!shipment) {
      return res.status(404).json({
        message: "Shipment not found"
      });
    }

    res.status(200).json(shipment);
  } catch (error) {
    res.status(500).json({
      message: "Failed to get shipment"
    });
  }
};

// PUT /api/shipments/:id
const updateShipment = async (req, res) => {
  try {
    const shipid = Number(req.params.id);
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        message: "status is required"
      });
    }

    const existingShipment = await prisma.shipment.findUnique({
      where: {
        shipid
      }
    });

    if (!existingShipment) {
      return res.status(404).json({
        message: "Shipment not found"
      });
    }

    const shipment = await prisma.shipment.update({
      where: {
        shipid
      },
      data: {
        status
      }
    });

    res.status(200).json(shipment);
  } catch (error) {
    res.status(500).json({
      message: "Failed to update shipment"
    });
  }
};

// DELETE /api/shipments/:id
const deleteShipment = async (req, res) => {
  try {
    const shipid = Number(req.params.id);

    const existingShipment = await prisma.shipment.findUnique({
      where: {
        shipid
      }
    });

    if (!existingShipment) {
      return res.status(404).json({
        message: "Shipment not found"
      });
    }

    await prisma.shipment.delete({
      where: {
        shipid
      }
    });

    res.status(200).json({
      message: "Shipment deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete shipment"
    });
  }
};

module.exports = {
  createShipment,
  getAllShipments,
  getShipmentById,
  updateShipment,
  deleteShipment
};