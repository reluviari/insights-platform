import { toReport } from "@/modules/report/repositories/mongo/utils";
import { Tenant } from "@/modules/tenant/entities/tenant";
import { Types } from "mongoose";

export function toTenant(doc: any): Tenant {
  return {
    ...doc,
    _id: doc._id.toString(),
    reports:
      doc.reports?.length > 0
        ? doc.reports?.map(report =>
            !Types.ObjectId.isValid(report) ? toReport(report) : report?.toString(),
          )
        : [],
    name: doc.name,
    phone: doc.phone,
    industry: doc.industry,
    urlSlug: doc.urlSlug,
    document: doc.document,
    externalWorkspaceId: doc.externalWorkspaceId,
    isActive: doc.isActive,
  };
}
