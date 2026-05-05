import performDatabaseHealthCheck from "@/modules/health-check/helpers/database.helper";
import { IDatabaseRepository } from "@/modules/health-check/interfaces";

describe("performDatabaseHealthCheck", () => {
  it("devolve resultado quando dbPerform resolve", async () => {
    const repo: IDatabaseRepository = {
      dbPerform: jest.fn().mockResolvedValue({
        dbAvailable: true,
        storageSize: 100,
        dataSize: 50,
        objects: 10,
        collections: 3,
      }),
    };

    const result = await performDatabaseHealthCheck(repo);

    expect(result?.dbAvailable).toBe(true);
    expect(result?.storageSize).toBe(100);
    expect(repo.dbPerform).toHaveBeenCalledTimes(1);
  });

  it("devolve null quando dbPerform lança", async () => {
    const repo: IDatabaseRepository = {
      dbPerform: jest.fn().mockRejectedValue(new Error("down")),
    };

    await expect(performDatabaseHealthCheck(repo)).resolves.toBeNull();
  });
});
