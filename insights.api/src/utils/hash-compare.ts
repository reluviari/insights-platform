import bcrypt from "bcryptjs";

export function hashCompareSync(plainText: string, hash: string) {
  return bcrypt.compareSync(plainText, hash);
}
