import { randomBytes } from "crypto";
import { database } from "./database";

// Security improvement: Custom error class
class TokenError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TokenError";
  }
}

// function untuk generate token verifikasi email
export const generateVerificationToken = async (email: string) => {
  try {
    const token = randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 3600000); // 1 hour

    // Delete token lama jika ada
    await database.verificationToken.deleteMany({
      where: { email },
    });

    const lowerCaseEmail = email.toLowerCase();
    // Membuat token baru
    await database.verificationToken.create({
      data: {
        email: lowerCaseEmail,
        token,
        expires,
      },
    });

    return token; // Return raw token for email
  } catch (error) {
    throw new TokenError("Gagal membuat token verifikasi");
  }
};
