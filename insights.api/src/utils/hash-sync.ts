import bcrypt from "bcryptjs";

export function hashSync(plainText: string) {
  const saltRounds = 8;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hash = bcrypt.hashSync(plainText, salt);
  return hash;
}
