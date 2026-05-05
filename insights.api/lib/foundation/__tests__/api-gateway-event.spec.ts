import {
  mergeHeadersAndMultiValue,
  parseApiGatewayJsonBody,
} from "../api-gateway-event";

describe("mergeHeadersAndMultiValue", () => {
  it("mergeia headers simples", () => {
    expect(mergeHeadersAndMultiValue({ Host: "localhost", origin: "http://localhost:3000" })).toEqual({
      Host: "localhost",
      origin: "http://localhost:3000",
    });
  });

  it("ignora valores vazios", () => {
    expect(mergeHeadersAndMultiValue({ a: "", b: "   " })).toEqual({});
  });

  it("usa multiValueHeaders quando a chave não existe em headers", () => {
    expect(
      mergeHeadersAndMultiValue(
        { origin: "http://a.com" },
        { Referer: ["http://b.com"] },
      ),
    ).toEqual({
      origin: "http://a.com",
      Referer: "http://b.com",
    });
  });

  it("não duplica chave com casing diferente já presente em headers", () => {
    expect(
      mergeHeadersAndMultiValue({ Origin: "http://first.com" }, { origin: ["http://second.com"] }),
    ).toEqual({
      Origin: "http://first.com",
    });
  });
});

describe("parseApiGatewayJsonBody", () => {
  it("parse string JSON", () => {
    expect(parseApiGatewayJsonBody({ body: '{"x":1}' })).toEqual({ x: 1 });
  });

  it("aceita objeto já parseado", () => {
    const obj = { email: "a@b.co", password: "x" };
    expect(parseApiGatewayJsonBody({ body: obj as Record<string, unknown> })).toBe(obj);
  });

  it("decodifica base64", () => {
    const json = JSON.stringify({ ok: true });
    const body = Buffer.from(json, "utf8").toString("base64");
    expect(parseApiGatewayJsonBody({ body, isBase64Encoded: true })).toEqual({ ok: true });
  });

  it("devolve null para body ausente ou vazio", () => {
    expect(parseApiGatewayJsonBody({ body: null })).toBeNull();
    expect(parseApiGatewayJsonBody({ body: "" })).toBeNull();
  });

  it("lança SyntaxError para JSON inválido em string", () => {
    expect(() => parseApiGatewayJsonBody({ body: "not-json" })).toThrow(SyntaxError);
  });
});
