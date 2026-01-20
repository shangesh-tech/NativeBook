import { Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import User from "../lib/models/User";

const protectRoute = async (
  req: any,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "No authentication token, access denied" });
    }

    const token = authHeader.replace("Bearer ", "");

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET is not defined");
    }

    // verify token
    const decoded = jwt.verify(token, secret) as JwtPayload;

    // find user
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(401).json({ message: "Token is not valid" });
    }

    req.user = user;
    next();
  } catch (error) {
    const err = error as Error;
    console.error("Authentication error:", err.message);
    return res.status(401).json({ message: "Token is not valid" });
  }
};

export default protectRoute;
