import { Schema, model } from "mongoose";

export const TENANT_SCHEMA = "tenants";

const TenantSchema = new Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: false },
    industry: { type: String, required: false },
    realmId: { type: String, required: false },
    urlSlug: { type: String, required: true, unique: true },
    document: { type: String, required: true },
    externalWorkspaceId: { type: String, required: true, unique: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const TenantModel = model(TENANT_SCHEMA, TenantSchema);
