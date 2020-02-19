const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const User = require("../models/User");
const auth = require("../middleware/auth");

router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: "Server error, mang..." });
  }
});

router.post(
  "/",
  [
    check("email", "Email is required...").isEmail(),
    check("password", "Password required...").exists()
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).json({ msg: "Invalid credentials..." });
    }

    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });

      if (!user) {
        return res.status(401).json({ msg: "User not found..." });
      }

      const isMatched = await bcrypt.compare(password, user.password);

      if (!isMatched) {
        res.status(400).json({ msg: "Invalid creds..." });
      }

      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(payload, config.get("jsToken"), (err, token) => {
        if (err) throw err;
        res.json({ token });
      });
    } catch (err) {
      res.status(500).json({ msg: "Server error..." });
    }
  }
);

module.exports = router;
