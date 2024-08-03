import { NextRequest, NextResponse } from 'next/server';
import connectMongo from '../../lib/connectMongo';
import User from '../../../models/User';

export async function GET(req: NextRequest) {
  await connectMongo();

  try {
    const users = await User.find({});
    return NextResponse.json({ users }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { newUser } = body;
  await connectMongo();

  try {
    if (!newUser) {
      return NextResponse.json({ message: 'New user data is required' }, { status: 400 });
    }
    const user = await User.create({ name: newUser, messages: 'broski' });
    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
