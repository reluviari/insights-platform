import { hasMoreItems, mergePaginationItems } from "./pagination-helpers";

describe("pagination-helpers", () => {
  describe("mergePaginationItems", () => {
    it("acrescenta linhas novas sem duplicar id", () => {
      const merged = mergePaginationItems(
        { rows: [{ id: "1", name: "a" }] },
        { rows: [{ id: "1", name: "dup" }, { id: "2", name: "b" }], page: 2 },
      );

      expect(merged.rows).toHaveLength(2);
      expect(merged.rows.map((r: { id: string }) => r.id)).toEqual(["1", "2"]);
      expect(merged.page).toBe(2);
    });

    it("usa lista vazia quando cache não tem rows", () => {
      const merged = mergePaginationItems(undefined, { rows: [{ id: "a" }] });
      expect(merged.rows).toEqual([{ id: "a" }]);
    });
  });

  describe("hasMoreItems", () => {
    it("indica quando há próxima página", () => {
      expect(hasMoreItems({ page: 1, pageSize: 10, count: 25 })).toBe(true);
      expect(hasMoreItems({ page: 3, pageSize: 10, count: 25 })).toBe(false);
    });
  });
});
