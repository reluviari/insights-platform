import { REPORT_FILTER_SCHEMA } from "@/modules/report-filter/repositories/mongo/report-filter/report-filter.schema";
import { REPORT_SCHEMA } from "@/modules/report/repositories/mongo/report/report.schema";
import { CUSTOMER_SCHEMA } from "@/modules/customer/repositories/mongo/customer/customer.schema";
import { Document, Schema, model } from "mongoose";
import { userRepository } from "@/modules/user/repositories/mongo/user/user.repository";
import { HttpStatus, ResponseError } from "@foundation/lib";
import { ExceptionsConstants } from "@/commons/consts/exceptions";

export const DEPARTMENT_SCHEMA = "departments";

interface DepartmentCondition extends Document {
  _conditions: {
    _id: string;
  };
}

const DepartmentSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    customer: { type: Schema.Types.ObjectId, required: true, ref: CUSTOMER_SCHEMA },
    reports: [{ type: Schema.Types.ObjectId, required: false, ref: REPORT_SCHEMA }],
    reportPages: [
      {
        reportId: { type: String, required: true },
        pages: [
          {
            name: { type: String, required: true },
            displayName: { type: String, required: true },
            visible: { type: Boolean, required: true },
          },
        ],
      },
    ],
    reportFilters: [{ type: Schema.Types.ObjectId, required: false, ref: REPORT_FILTER_SCHEMA }],
    isActive: { type: Boolean, require: false, default: true },
  },
  { timestamps: true },
);

DepartmentSchema.pre("deleteOne", async function (this: DepartmentCondition) {
  try {
    const departmentId = this._conditions._id;

    await userRepository.updateUsersDepartments(departmentId);
  } catch (err) {
    throw new ResponseError(
      ExceptionsConstants.INTERNAL_SERVER_ERROR,
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
});

export const DepartmentModel = model(DEPARTMENT_SCHEMA, DepartmentSchema);
