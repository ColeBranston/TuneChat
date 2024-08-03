import { NextApiRequest, NextApiResponse } from "next";
import connectMongo from "../../lib/connectMongo";
import User from "../../../models/User";

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  await connectMongo();

  try {
    const users = await User.find({});
    return res.status(200).json({ users });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
}

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  const { newUser } = req.body;
  await connectMongo();

  try {
    if (!newUser) {
      return res.status(400).json({ message: "New user data is required" });
    }
    const user = await User.create({ name: newUser, messages: "broski" });
    return res.status(201).json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
}
