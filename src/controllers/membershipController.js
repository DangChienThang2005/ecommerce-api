const prisma = require("../utils/prisma");

// GET /api/memberships
const getAllMemberships = async (req, res) => {
  try {
    const memberships = await prisma.memberShip.findMany();

    res.status(200).json(memberships);
  } catch (error) {
    res.status(500).json({
      message: "Failed to get memberships"
    });
  }
};

// GET /api/memberships/:id
const getMembershipById = async (req, res) => {
  try {
    const mid = parseInt(req.params.id);

    const membership = await prisma.memberShip.findUnique({
      where: { mid }
    });

    if (!membership) {
      return res.status(404).json({
        message: "Membership not found"
      });
    }

    res.status(200).json(membership);
  } catch (error) {
    res.status(500).json({
      message: "Failed to get membership"
    });
  }
};

// POST /api/memberships
const createMembership = async (req, res) => {
  try {
    const { mname, score } = req.body;

    if (!mname || score === undefined) {
      return res.status(400).json({
        message: "mname and score are required"
      });
    }

    const membership = await prisma.memberShip.create({
      data: {
        mname,
        score: Number(score)
      }
    });

    res.status(201).json(membership);
  } catch (error) {
    res.status(500).json({
      message: "Failed to create membership"
    });
  }
};

// PUT /api/memberships/:id
const updateMembership = async (req, res) => {
  try {
    const mid = parseInt(req.params.id);
    const { mname, score } = req.body;

    if (!mname || score === undefined) {
      return res.status(400).json({
        message: "mname and score are required"
      });
    }

    const existingMembership = await prisma.memberShip.findUnique({
      where: { mid }
    });

    if (!existingMembership) {
      return res.status(404).json({
        message: "Membership not found"
      });
    }

    const membership = await prisma.memberShip.update({
      where: { mid },
      data: {
        mname,
        score: Number(score)
      }
    });

    res.status(200).json(membership);
  } catch (error) {
    res.status(500).json({
      message: "Failed to update membership"
    });
  }
};

// DELETE /api/memberships/:id
const deleteMembership = async (req, res) => {
  try {
    const mid = parseInt(req.params.id);

    const existingMembership = await prisma.memberShip.findUnique({
      where: { mid }
    });

    if (!existingMembership) {
      return res.status(404).json({
        message: "Membership not found"
      });
    }

    await prisma.memberShip.delete({
      where: { mid }
    });

    res.status(200).json({
      message: "Membership deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete membership"
    });
  }
};

module.exports = {
  getAllMemberships,
  getMembershipById,
  createMembership,
  updateMembership,
  deleteMembership
};