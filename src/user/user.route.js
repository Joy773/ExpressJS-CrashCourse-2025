import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "./user.mode.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.get("/:userId", auth, async (req, res, next) => {
  const requestUserId = req.params.userId;
  const tokenUserId = req.userId;
  if (requestUserId !== tokenUserId) {
    const error = new Error("Not allowed!");
    error.statusCode = 403;
    next();
    return;
  }
  const user = await User.findOne({_id: requestUserId}, {password: false, __v: false}); 
  res.json(user);
});
//api/users
router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({
    email,
  });
  if (!user) {
    const error = new Error("Invalid Credentials");
    error.statusCode = 400;
    next(error);
    return;
  }
  const matched = bcrypt.compareSync(password, user.password);
  if (!matched) {
    const error = new Error("Invalid Credentials");
    error.statusCode = 400;
    next(error);
    return;
  }
  const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
    expiresIn: 60 * 60,
  });
  res.json({ token });
});

router.post("/", async (req, res, next) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    const error = new Error("all fields are required!");
    error.statusCode = 400;
    next(error);
    // res.status(400).json({message: "All fields are required!"});
    // return;
  }
  try {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    const result = await User.create({
      name,
      email,
      password: hash,
    });
    res.status(201).json({ id: result._id });
  } catch (err) {
    next(err);
  }
});

export default router;
