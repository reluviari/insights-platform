import { IDatabaseRepository } from "../interfaces";
import { DatabaseHealthCheckResult, HealthCheckDbResultType } from "../types";

const performDatabaseHealthCheck = async (
  iDatabaseRepository: IDatabaseRepository,
): Promise<DatabaseHealthCheckResult> => {
  try {
    const databasePerform = await iDatabaseRepository.dbPerform();

    return databasePerform as HealthCheckDbResultType;
  } catch (error) {
    return null;
  }
};

export default performDatabaseHealthCheck;
