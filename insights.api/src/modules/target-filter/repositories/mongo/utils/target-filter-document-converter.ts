import { TargetFilter } from "@/modules/target-filter/entities";
import { toReport } from "@/modules/report/repositories/mongo/utils";
import { Types } from "mongoose";

export function toTargetFilter(doc: any): TargetFilter {
  return {
    ...doc,
    _id: doc._id.toString(),
    report:
      doc.report && !Types.ObjectId.isValid(doc.report)
        ? toReport(doc.report)
        : doc?.report?.toString(),
  };
}
