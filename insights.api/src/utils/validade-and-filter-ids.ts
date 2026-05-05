import { IReportFilterRepository } from "@/modules/report-filter/interfaces";
import { IReportRepository } from "@/modules/report/interfaces";
import { Types } from "mongoose";

export async function validateAndFilterIds(
  ids: string[] | undefined,
  repository: IReportRepository | IReportFilterRepository,
): Promise<string[]> {
  if (!ids || !ids.length) {
    return [];
  }

  const validIds = [];
  const invalidIds = [];

  for (const id of ids) {
    const isValidObjectId = Types.ObjectId.isValid(id);

    if (!isValidObjectId) {
      invalidIds.push(id);
      continue;
    }

    const data = await repository.findById(id);

    if (data) validIds.push(data._id);
    if (!data) invalidIds.push(id);
  }

  if (invalidIds.length > 0) {
    // create a task to handle this conditional
  }

  return validIds;
}
