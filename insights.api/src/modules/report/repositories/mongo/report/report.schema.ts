import { TENANT_SCHEMA } from "@/modules/tenant/repositories/mongo/tenant/tenant.schema";
import { Schema, model } from "mongoose";

export const REPORT_SCHEMA = "reports";

const ReportSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    externalId: { type: String, required: true },
    icon: { type: String, required: false },
    description: { type: String, required: false },
    tenant: { type: Schema.Types.ObjectId, ref: TENANT_SCHEMA, require: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const ReportModel = model(REPORT_SCHEMA, ReportSchema);
