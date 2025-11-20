/** @format */

const { compare, hash } = require("bcrypt");

export async function hashPassword(password) {
  const hashedPassword = await hash(password, 12);
  return hashedPassword;
}

export async function verifyPassword(originalPassword, hashedPassword) {
  const isValidPassword = await compare(originalPassword, hashedPassword);
  return isValidPassword;
}
