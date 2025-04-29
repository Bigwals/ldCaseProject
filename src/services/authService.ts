import bcrypt from "bcryptjs";
import jwt, { Secret, SignOptions, JwtPayload } from 'jsonwebtoken';
import dotenv from "dotenv";
dotenv.config();

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET || "ls1case2db3";



// Hash a password before saving to DB
export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, SALT_ROUNDS);
};

// Compare a plain password with a hashed one
export const comparePasswords = async (
  plain: string,
  hash: string
): Promise<boolean> => {
  return await bcrypt.compare(plain, hash);
};

export interface TokenPayload extends JwtPayload {
  userId: number;
}

// Allow expiresIn to be either string or number—as JWT supports both
type ExpiresIn = SignOptions['expiresIn'];

// Generate JWT token
export const generateToken = (
  payload: TokenPayload,
  expiresIn: ExpiresIn = '1d'
): string => {
  // Build an options object and tell TS “this is definitely a SignOptions”
  const options = { expiresIn } as SignOptions;

  // Cast your secret to Secret, too
  return jwt.sign(payload, JWT_SECRET as Secret, options);
};