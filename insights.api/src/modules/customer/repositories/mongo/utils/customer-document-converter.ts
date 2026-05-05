import { toReport } from "@/modules/report/repositories/mongo/utils";
import { Customer } from "@/modules/customer/entities";
import { Types } from "mongoose";
import { toTenant } from "@/modules/tenant/repositories/mongo/utils/tenant-document-converter";

export function toCustomer(doc: any): Customer {
  return {
    ...doc,
    _id: doc._id.toString(),
    tenant:
      doc?.tenant && !Types.ObjectId.isValid(doc?.tenant)
        ? toTenant(doc.tenant)
        : doc?.tenant?.toString(),
    reports:
      doc.reports.length > 0
        ? doc.reports?.map(report =>
            !Types.ObjectId.isValid(report) ? toReport(report) : report?.toString(),
          )
        : [],
  };
}
