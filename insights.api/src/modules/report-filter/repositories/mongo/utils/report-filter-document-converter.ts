import { toCustomer } from "@/modules/customer/repositories/mongo/utils";
import { ReportFilter } from "@/modules/report-filter/entities";
import { toReport } from "@/modules/report/repositories/mongo/utils";
import { toTargetFilter } from "@/modules/target-filter/repositories/mongo/utils";
import { Types } from "mongoose";

export function toReportFilter(doc: any): ReportFilter {
  return {
    ...doc,
    _id: doc._id.toString(),
    report:
      doc.report && !Types.ObjectId.isValid(doc.report)
        ? toReport(doc.report)
        : doc?.report?.toString(),
    customer:
      doc.customer && !Types.ObjectId.isValid(doc.customer)
        ? toCustomer(doc.customer)
        : doc?.customer?.toString(),
    target:
      doc.target && !Types.ObjectId.isValid(doc.target)
        ? toTargetFilter(doc.target)
        : doc?.target?.toString(),
  };
}
