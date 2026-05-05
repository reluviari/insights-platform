import { toDepartment } from "@/modules/department/repositories/mongo/utils";
import { toReportFilter } from "@/modules/report-filter/repositories/mongo/utils";
import { toReport } from "@/modules/report/repositories/mongo/utils";
import { toCustomer } from "@/modules/customer/repositories/mongo/utils";
import { toTenant } from "@/modules/tenant/repositories/mongo/utils/tenant-document-converter";
import { User } from "@/modules/user/entities";
import { Types } from "mongoose";

export function toUser(doc: any): User {
  const tenants = doc.tenants ?? [];
  const departments = doc.departments ?? [];
  const reports = doc.reports ?? [];
  const reportFilters = doc.reportFilters ?? [];

  return {
    ...doc,
    _id: doc._id.toString(),
    customer:
      doc.customer && !Types.ObjectId.isValid(doc.customer)
        ? toCustomer(doc.customer)
        : doc?.customer?.toString(),
    tenants:
      tenants.length > 0
        ? tenants.map((tenant: unknown) =>
            !Types.ObjectId.isValid(tenant) ? toTenant(tenant) : (tenant as any)?.toString(),
          )
        : [],
    departments:
      departments.length > 0
        ? departments.map((department: unknown) =>
            !Types.ObjectId.isValid(department)
              ? toDepartment(department)
              : (department as any)?.toString(),
          )
        : [],
    reports:
      reports.length > 0
        ? reports.map((report: unknown) =>
            !Types.ObjectId.isValid(report) ? toReport(report) : (report as any)?.toString(),
          )
        : [],
    reportFilters:
      reportFilters.length > 0
        ? reportFilters.map((reportFilter: unknown) =>
            !Types.ObjectId.isValid(reportFilter)
              ? toReportFilter(reportFilter)
              : (reportFilter as any)?.toString(),
          )
        : [],
  };
}
