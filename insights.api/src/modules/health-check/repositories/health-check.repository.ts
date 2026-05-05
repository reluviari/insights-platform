import { MongoClient } from "mongodb";

import { IDatabaseRepository } from "../interfaces/health-check-repository.interface";
import { HealthCheckDbResultType } from "../types";

export class HealthCheckRepository implements IDatabaseRepository {
  async dbPerform(): Promise<HealthCheckDbResultType | boolean> {
    const client = new MongoClient(process.env.MONGODB_URI);

    try {
      const connectionPromise = client.connect();
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Timeout exceeded")), 10000),
      );

      await Promise.race([connectionPromise, timeoutPromise]);
      const db = await client.db();

      const ping = await db.command({ ping: 1 });
      const stats = await db.stats();

      return { dbAvailable: Boolean(ping), ...stats };
    } catch (error) {
      if (error instanceof Error) return { dbAvailable: false, error: error.message };
    } finally {
      await client.close();
    }
  }
}
