import { Department } from "@/modules/department/entities";
import { toReportFilter } from "@/modules/report-filter/repositories/mongo/utils";
import { toReport } from "@/modules/report/repositories/mongo/utils";
import { toCustomer } from "@/modules/customer/repositories/mongo/utils";
import { Types } from "mongoose";

export function toDepartment(doc: any): Department {
  return {
    ...doc,
    _id: doc._id.toString(),
    customer:
      doc?.customer && !Types.ObjectId.isValid(doc?.customer)
        ? toCustomer(doc.customer)
        : doc?.customer?.toString(),
    reportFilters:
      doc.reportFilters.length > 0
        ? doc.reportFilters?.map(reportFilter =>
            !Types.ObjectId.isValid(reportFilter)
              ? toReportFilter(reportFilter)
              : reportFilter?.toString(),
          )
        : [],
    reports:
      doc.reports.length > 0
        ? doc.reports?.map(report =>
            !Types.ObjectId.isValid(report) ? toReport(report) : report?.toString(),
          )
        : [],
  };
}
