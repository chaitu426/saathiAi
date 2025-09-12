import dotenv from "dotenv";
dotenv.config();

export const environment = {
  port: process.env.PORT || 3000,
  databaseURL: process.env.DATABASE_URL || "postgresql://user:password@localhost:5432/mydb",
  jwtsecret: process.env.JWT_JWT_SECRET || "changeme",
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
};