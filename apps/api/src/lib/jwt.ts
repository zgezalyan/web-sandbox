import jwt from "jsonwebtoken";
import { config } from "../config.js";

export type TokenPayload = {
  sub: number;
  email: string;
  username: string;
};

export function signToken(payload: TokenPayload): string {
  return jwt.sign(
    { email: payload.email, username: payload.username },
    config.jwtSecret,
    {
      subject: String(payload.sub),
      expiresIn: config.jwtExpiresIn,
    } as jwt.SignOptions,
  );
}

export function verifyToken(token: string): TokenPayload {
  const decoded = jwt.verify(token, config.jwtSecret);
  if (typeof decoded !== "object" || decoded === null) {
    throw new Error("Invalid token");
  }
  const sub = typeof decoded.sub === "string" ? Number(decoded.sub) : decoded.sub;
  if (typeof sub !== "number" || !Number.isInteger(sub) || typeof decoded.email !== "string") {
    throw new Error("Invalid token");
  }
  return {
    sub,
    email: decoded.email,
    username: typeof decoded.username === "string" ? decoded.username : "",
  };
}
