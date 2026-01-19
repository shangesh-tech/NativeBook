import { Router, Request, Response } from "express";
import jwt, { SignOptions } from "jsonwebtoken";
import User from "../lib/models/User";
import bcrypt from "bcryptjs";

const router = Router();

interface RegisterBody {
  email: string;
  username: string;
  password: string;
}

interface LoginBody {
  email: string;
  password: string;
}

const generateToken = (userId: string): string => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not defined");
  }

  const options: SignOptions = {
    expiresIn: "7d",
  };

  return jwt.sign({ userId }, secret, options);
};

router.post(
  "/register",
  async (
    req: Request<{}, {}, RegisterBody>,
    res: Response,
  ): Promise<Response> => {
    try {
      const { email, username, password } = req.body;

      if (!email || !username || !password) {
        return res.status(400).json({ message: "All fields are required" });
      }

      if (password.length < 6) {
        return res
          .status(400)
          .json({ message: "Password should be at least 6 characters long" });
      }

      if (username.length < 3) {
        return res
          .status(400)
          .json({ message: "Username should be at least 3 characters long" });
      }

      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }

      const existingUsername = await User.findOne({ username });
      if (existingUsername) {
        return res.status(400).json({ message: "Username already exists" });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const profileImage = `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`;

      const user = new User({
        email,
        username,
        password: hashedPassword,
        profileImage,
      });

      await user.save();

      const token = generateToken(user._id.toString());

      return res.status(201).json({
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          profileImage: user.profileImage,
          createdAt: user.createdAt,
        },
      });
    } catch (error) {
      console.error("Error in register route", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },
);

router.post(
  "/login",
  async (req: Request<{}, {}, LoginBody>, res: Response): Promise<Response> => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: "All fields are required" });
      }

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      const isPasswordCorrect = await bcrypt.compare(password, user.password);

      if (!isPasswordCorrect) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      const token = generateToken(user._id.toString());

      return res.status(200).json({
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          profileImage: user.profileImage,
          createdAt: user.createdAt,
        },
      });
    } catch (error) {
      console.error("Error in login route", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },
);

export default router;
