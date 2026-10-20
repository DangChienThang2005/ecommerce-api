const prisma = require("../utils/prisma");

// GET /api/roles
const getAllRoles = async (req, res) => {
  try {
    const roles = await prisma.role.findMany();

    res.status(200).json(roles);
  } catch (error) {
    res.status(500).json({
      message: "Failed to get roles"
    });
  }
};

// GET /api/roles/:id
const getRoleById = async (req, res) => {
  try {
    const roleid = parseInt(req.params.id);

    const role = await prisma.role.findUnique({
      where: { roleid }
    });

    if (!role) {
      return res.status(404).json({
        message: "Role not found"
      });
    }

    res.status(200).json(role);
  } catch (error) {
    res.status(500).json({
      message: "Failed to get role"
    });
  }
};

// POST /api/roles
const createRole = async (req, res) => {
  try {
    const { rolename } = req.body;

    if (!rolename) {
      return res.status(400).json({
        message: "rolename is required"
      });
    }

    const role = await prisma.role.create({
      data: {
        rolename
      }
    });

    res.status(201).json(role);
  } catch (error) {
    res.status(500).json({
      message: "Failed to create role"
    });
  }
};

// PUT /api/roles/:id
const updateRole = async (req, res) => {
  try {
    const roleid = parseInt(req.params.id);
    const { rolename } = req.body;

    if (!rolename) {
      return res.status(400).json({
        message: "rolename is required"
      });
    }

    const existingRole = await prisma.role.findUnique({
      where: { roleid }
    });

    if (!existingRole) {
      return res.status(404).json({
        message: "Role not found"
      });
    }

    const role = await prisma.role.update({
      where: { roleid },
      data: { rolename }
    });

    res.status(200).json(role);
  } catch (error) {
    res.status(500).json({
      message: "Failed to update role"
    });
  }
};

// DELETE /api/roles/:id
const deleteRole = async (req, res) => {
  try {
    const roleid = parseInt(req.params.id);

    const existingRole = await prisma.role.findUnique({
      where: { roleid }
    });

    if (!existingRole) {
      return res.status(404).json({
        message: "Role not found"
      });
    }

    await prisma.role.delete({
      where: { roleid }
    });

    res.status(200).json({
      message: "Role deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete role"
    });
  }
};

module.exports = {
  getAllRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole
};