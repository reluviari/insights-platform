import { Types } from "mongoose";
import { Report } from "@/modules/report/entities";
import { toTenant } from "@/modules/tenant/repositories/mongo/utils/tenant-document-converter";

export function toReport(doc: any): Report {
  return {
    ...doc,
    _id: doc._id?.toString(),
    tenant:
      doc?.tenant && !Types.ObjectId.isValid(doc?.tenant)
        ? toTenant(doc.tenant)
        : doc?.tenant?.toString(),
  };
}
