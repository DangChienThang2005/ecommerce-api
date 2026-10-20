const prisma = require("../utils/prisma");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  try {
    const { username, fullname, password, roleid, mid } = req.body;

    if (!username || !fullname || !password || !roleid || !mid) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: { username }
    });

    if (existingUser) {
      return res.status(409).json({
        message: "Username already exists"
      });
    }

    const role = await prisma.role.findUnique({
      where: {
        roleid: Number(roleid)
      }
    });

    if (!role) {
      return res.status(400).json({
        message: "Invalid roleid"
      });
    }

    const membership = await prisma.memberShip.findUnique({
      where: {
        mid: Number(mid)
      }
    });

    if (!membership) {
      return res.status(400).json({
        message: "Invalid mid"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        fullname,
        password: hashedPassword,
        roleid: Number(roleid),
        mid: Number(mid)
      }
    });

    res.status(201).json({
      uid: user.uid,
      username: user.username,
      fullname: user.fullname,
      roleid: user.roleid,
      mid: user.mid
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to register user"
    });
  }
};
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: "Username and password are required"
      });
    }

    const user = await prisma.user.findUnique({
      where: { username }
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid username or password"
      });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid username or password"
      });
    }

    const token = jwt.sign(
      {
        uid: user.uid,
        username: user.username,
        roleid: user.roleid
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN
      }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        uid: user.uid,
        username: user.username,
        fullname: user.fullname,
        roleid: user.roleid,
        mid: user.mid
      }
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to login"
    });
  }
};

module.exports = {
  register,
  login
};