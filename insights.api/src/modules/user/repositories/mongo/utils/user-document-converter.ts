import { toDepartment } from "@/modules/department/repositories/mongo/utils";
import { toReportFilter } from "@/modules/report-filter/repositories/mongo/utils";
import { toReport } from "@/modules/report/repositories/mongo/utils";
import { toCustomer } from "@/modules/customer/repositories/mongo/utils";
import { toTenant } from "@/modules/tenant/repositories/mongo/utils/tenant-document-converter";
import { User } from "@/modules/user/entities";
import { Types } from "mongoose";

export function toUser(doc: any): User {
  return {
    ...doc,
    _id: doc._id.toString(),
    customer:
      doc.customer && !Types.ObjectId.isValid(doc.customer)
        ? toCustomer(doc.customer)
        : doc?.customer?.toString(),
    tenants:
      doc.tenants.length > 0
        ? doc.tenants.map(tenant =>
            !Types.ObjectId.isValid(tenant) ? toTenant(tenant) : tenant?.toString(),
          )
        : [],
    departments:
      doc.departments.length > 0
        ? doc.departments.map(department =>
            !Types.ObjectId.isValid(department) ? toDepartment(department) : department?.toString(),
          )
        : [],
    reports:
      doc.reports.length > 0
        ? doc.reports?.map(report =>
            !Types.ObjectId.isValid(report) ? toReport(report) : report?.toString(),
          )
        : [],
    reportFilters:
      doc.reportFilters.length > 0
        ? doc.reportFilters?.map(reportFilter =>
            !Types.ObjectId.isValid(reportFilter)
              ? toReportFilter(reportFilter)
              : reportFilter?.toString(),
          )
        : [],
  };
}
