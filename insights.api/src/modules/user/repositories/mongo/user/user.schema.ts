import { DEPARTMENT_SCHEMA } from "@/modules/department/repositories/mongo/department/department.schema";
import { REPORT_FILTER_SCHEMA } from "@/modules/report-filter/repositories/mongo/report-filter/report-filter.schema";
import { REPORT_SCHEMA } from "@/modules/report/repositories/mongo/report/report.schema";
import { CUSTOMER_SCHEMA } from "@/modules/customer/repositories/mongo/customer/customer.schema";
import { TENANT_SCHEMA } from "@/modules/tenant/repositories/mongo/tenant/tenant.schema";
import { Schema, model } from "mongoose";
import { Roles } from "@/modules/auth/roles/enums";

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    clientId: { type: String, required: false },
    phone: { type: String, required: false },
    password: { type: String, required: false, select: false },
    avatar: { type: String, required: false },
    isActive: { type: Boolean, default: true },
    roles: {
      type: [String],
      enum: { values: Object.values(Roles) },
      default: [Roles.USER],
      required: true,
    },
    passwordToken: { type: String, require: false },
    createdTokenAt: { type: Number, required: false },
    tenants: [{ type: Schema.Types.ObjectId, required: false, ref: TENANT_SCHEMA }],
    customer: { type: Schema.Types.ObjectId, required: false, ref: CUSTOMER_SCHEMA },
    departments: [{ type: Schema.Types.ObjectId, required: false, ref: DEPARTMENT_SCHEMA }],
    reports: [{ type: Schema.Types.ObjectId, required: false, ref: REPORT_SCHEMA }],
    reportFilters: [{ type: Schema.Types.ObjectId, required: false, ref: REPORT_FILTER_SCHEMA }],
  },
  { timestamps: true },
);

export const UserModel = model("users", UserSchema);
