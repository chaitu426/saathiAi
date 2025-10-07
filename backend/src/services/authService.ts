import { AuthInput } from '../validator/authValidator.js';
import { findUserByEmail } from '../controllers/userController.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { db } from '../config/db.js';
import { user, frame } from '../db/schema.js';
import { environment } from '../config/environment.js';
import { desc, eq } from 'drizzle-orm';

const JWT_SECRET = environment.jwtsecret;
if (!JWT_SECRET) {
  throw new Error("JWT secret is not configured");
}


export const loginService = async (input: AuthInput) => {
  const existingUser = await findUserByEmail(input.email);
  if (!existingUser) {
    throw new Error('Invalid credentials');
  }

  if (!existingUser.username || !existingUser.email || !existingUser.password_hash) {
    throw new Error("User data is incomplete");
  }

  const valid = await bcrypt.compare(input.password, existingUser.password_hash);
  if (!valid) {
    throw new Error('Invalid credentials');
  }

  const token = jwt.sign(
    { id: existingUser.id, username: existingUser.username, email: existingUser.email },
    JWT_SECRET,
    { expiresIn: '1d' }
  );

  const latestchat = await db.select().from(frame).where(eq(frame.user_id , existingUser.id)).orderBy(desc(frame.created_at)).limit(1);


  return {
    message: 'Login successful',
    token,
    user: { id: existingUser.id,username: existingUser.username, email: existingUser.email, latestchat: latestchat[0]?.id}
  };
};

export const registerService = async (input: AuthInput) => {
  const existingUser = await findUserByEmail(input.email);
  if (existingUser) {
    throw new Error('Email already registered');
  }

  if (!input.username?.trim() || !input.email?.trim() || !input.password?.trim()) {
    throw new Error("All fields are required");
  }

  const passwordHash = await bcrypt.hash(input.password, 10);

  // Insert user and return id
  const [newUser] = await db.insert(user).values({
    username: input.username,
    email: input.email,
    password_hash: passwordHash,
  }).returning({ id: user.id, username: user.username, email: user.email });

  // Now newUser has { id, username, email }
  const token = jwt.sign(
    { id: newUser?.id, username: newUser?.username, email: newUser?.email },
    JWT_SECRET,
    { expiresIn: '1d' }
  );

  return {
    message: 'Registration successful',
    token,
    user: { id: newUser?.id, username: newUser?.username, email: newUser?.email }
  };
};



// Additional services like password reset, profile update, etc. can be added here
// Ensure to handle errors and edge cases appropriately

// You can also add utility functions related to authentication here
// For example, token verification, password strength checking, etc.