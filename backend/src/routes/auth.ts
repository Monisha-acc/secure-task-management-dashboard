import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../db/database";
import { AuthRequest, User } from "../types";

const router = Router();

// POST /api/auth/register
router.post("/register", (req: Request, res: Response): void => {
  const { username, password } = req.body as AuthRequest;

  if (!username || !password) {
    res.status(400).json({ message: "Username and password are required" });
    return;
  }

  if (username.length < 3) {
    res.status(400).json({ message: "Username must be at least 3 characters" });
    return;
  }

  if (password.length < 6) {
    res.status(400).json({ message: "Password must be at least 6 characters" });
    return;
  }

  // Check for at least one number
  if (!/\d/.test(password)) {
    res
      .status(400)
      .json({ message: "Password must contain at least one number" });
    return;
  }

  // Check for at least one special character
  if (!/[!@#$%^&*]/.test(password)) {
    res.status(400).json({
      message: "Password must contain at least one special character",
    });
    return;
  }

  const existing = db
    .prepare("SELECT id FROM users WHERE username = ?")
    .get(username);
  if (existing) {
    res.status(409).json({ message: "Username already taken" });
    return;
  }

  const password_hash = bcrypt.hashSync(password, 10);
  const result = db
    .prepare("INSERT INTO users (username, password_hash) VALUES (?, ?)")
    .run(username, password_hash);

  const token = jwt.sign(
    { userId: result.lastInsertRowid },
    process.env.JWT_SECRET as string,
    { expiresIn: "7d" },
  );

  res.status(201).json({ token, username });
});

// POST /api/auth/login
router.post("/login", (req: Request, res: Response): void => {
  const { username, password } = req.body as AuthRequest;

  if (!username || !password) {
    res.status(400).json({ message: "Username and password are required" });
    return;
  }

  const user = db
    .prepare("SELECT * FROM users WHERE username = ?")
    .get(username) as User | undefined;

  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    res.status(401).json({ message: "Invalid credentials" });
    return;
  }

  const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET as string,
    { expiresIn: "7d" },
  );

  res.json({ token, username: user.username });
});

export default router;
