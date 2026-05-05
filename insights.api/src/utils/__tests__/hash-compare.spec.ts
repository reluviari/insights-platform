import { hashCompareSync } from "@/utils/hash-compare";
import bcrypt from "bcryptjs";

describe("hashCompareSync", () => {
  const plain = "TestPass1!";
  let hash: string;

  beforeAll(() => {
    hash = bcrypt.hashSync(plain, 8);
  });

  it("devolve true quando o hash corresponde", () => {
    expect(hashCompareSync(plain, hash)).toBe(true);
  });

  it("devolve false quando a senha está errada", () => {
    expect(hashCompareSync("outra", hash)).toBe(false);
  });

  it("devolve false quando hash é undefined ou vazio (sem lançar)", () => {
    expect(hashCompareSync(plain, undefined)).toBe(false);
    expect(hashCompareSync(plain, null)).toBe(false);
    expect(hashCompareSync(plain, "")).toBe(false);
  });
});
