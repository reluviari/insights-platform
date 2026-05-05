import { REPORT_SCHEMA } from "@/modules/report/repositories/mongo/report/report.schema";
import { TENANT_SCHEMA } from "@/modules/tenant/repositories/mongo/tenant/tenant.schema";
import { Schema, model } from "mongoose";

export const CUSTOMER_SCHEMA = "customers";

const CustomerSchema = new Schema(
  {
    name: { type: String, required: true },
    document: { type: String, required: true, unique: true },
    industry: { type: String, required: false },
    clientId: { type: String, required: false },
    phone: { type: String, required: false },
    logo: { type: String, required: false },
    reports: [{ type: Schema.Types.ObjectId, ref: REPORT_SCHEMA, required: false }],
    tenant: { type: Schema.Types.ObjectId, ref: TENANT_SCHEMA, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const CustomerModel = model(CUSTOMER_SCHEMA, CustomerSchema);
