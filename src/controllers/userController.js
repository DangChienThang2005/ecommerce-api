const prisma = require("../utils/prisma");

// GET /api/users
const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        uid: true,
        username: true,
        fullname: true,
        roleid: true,
        mid: true,
        role: true,
        membership: true
      }
    });

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({
      message: "Failed to get users"
    });
  }
};

// GET /api/users/:id
const getUserById = async (req, res) => {
  try {
    const uid = Number(req.params.id);

    const user = await prisma.user.findUnique({
      where: {
        uid
      },
      select: {
        uid: true,
        username: true,
        fullname: true,
        roleid: true,
        mid: true,
        role: true,
        membership: true
      }
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      message: "Failed to get user"
    });
  }
};

module.exports = {
  getAllUsers,
  getUserById
};