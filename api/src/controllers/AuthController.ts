import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/User";
import validator from "validator";

export async function register(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body;

  if (!email || !validator.isEmail(email)) {
    res.status(400).json({ message: "Please enter a valid email address" });
    return;
  }

  // Check if password is at least 8 characters long, contains at least one special character, and at least one uppercase character
  if (
    !password ||
    password.length < 8 ||
    !/[!@#$%^&*(),.?":{}|<>]/g.test(password) ||
    !/[A-Z]/g.test(password)
  ) {
    let errorMessage =
      "Password must be at least 8 characters long and include at least one uppercase letter and one special character";
    if (!password) {
      errorMessage = "Please enter a password";
    } else if (password.length < 8) {
      errorMessage = "Password must be at least 8 characters long";
    } else if (!/[!@#$%^&*(),.?":{}|<>]/g.test(password)) {
      errorMessage = "Password must include at least one special character";
    } else if (!/[A-Z]/g.test(password)) {
      errorMessage = "Password must include at least one uppercase letter";
    }
    res.status(400).json({ message: errorMessage });
    return;
  }

  try {
    let user: IUser | null = await User.findOne({ email });

    if (user) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user = await User.create({ email, password: hashedPassword });

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || "secret"
    );
    res.status(200).json({ user: { email, token } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    if (!email || !validator.isEmail(email)) {
      res.status(400).json({ message: "Please enter a valid email address" });
      return;
    }

    if (!password) {
      res.status(400).json({ message: "Please enter password" });
      return;
    }

    // Check if the user exists
    const user: IUser | null = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check if the password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!);

    res.status(200).json({ user: { email, token } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}
