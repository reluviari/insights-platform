import bcrypt from "bcryptjs";

export function hashCompareSync(plainText: string, hash: string | undefined | null): boolean {
  if (hash == null || typeof hash !== "string" || hash.length === 0) {
    return false;
  }
  return bcrypt.compareSync(plainText, hash);
}
