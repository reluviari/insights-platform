import { isValidUrlSlug } from "@/utils/valid-url-slug";

describe("isValidUrlSlug", () => {
  it("aceita localhost com porta (dev)", () => {
    expect(isValidUrlSlug("http://localhost:3000")).toBe(true);
    expect(isValidUrlSlug("https://localhost:3000")).toBe(true);
  });

  it("aceita domínio típico https", () => {
    expect(isValidUrlSlug("https://app.example.com")).toBe(true);
    expect(isValidUrlSlug("https://tenant.insights.io/path")).toBe(true);
  });

  it("rejeita valores inválidos", () => {
    expect(isValidUrlSlug("")).toBe(false);
    expect(isValidUrlSlug("not-a-url")).toBe(false);
    expect(isValidUrlSlug("ftp://example.com")).toBe(false);
  });
});
