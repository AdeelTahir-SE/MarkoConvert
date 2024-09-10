import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { getUserByEmail } from "./prisma.js";
dotenv.config();

export async function Protected(req,res,next) {
  const [,token] = (req.headers.authorization).split(" "); // 'authorization' should be lowercase in Express
  console.log(token)
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const user = verifyToken(token);
    console.log(user)
    const User = await getUserByEmail(user.user);
    console.log(User)
    req.user = { id: User.id };
    next();
  } catch (error) {
    console.log(error)
    res.status(401).json({ message: "Unauthorized" });
  }
}

export function createToken(user) {
  return jwt.sign({ user: user.email }, process.env.SECRET, {
    expiresIn: "1h",
  });
}
export function verifyToken(token) {
  return jwt.verify(token, process.env.SECRET);
}

export function hashPassword(password){
    return bcrypt.hash(password,10);
}
