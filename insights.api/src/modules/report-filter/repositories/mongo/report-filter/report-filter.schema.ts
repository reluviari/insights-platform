import { Document, Schema, model } from "mongoose";
import {
  AdvancedFilterConditionOperatorsEnum,
  AdvancedFilterLogicalOperatorsEnum,
  FilterOperatorsEnum,
  FilterType,
  RelativeDateFilterTimeUnitEnum,
} from "@/modules/report-filter/enums";
import { REPORT_SCHEMA } from "@/modules/report/repositories/mongo/report/report.schema";
import { CUSTOMER_SCHEMA } from "@/modules/customer/repositories/mongo/customer/customer.schema";
import { TARGET_FILTER_SCHEMA } from "@/modules/target-filter/repositories/mongo/target-filter/target-filter.schema";
import { userRepository } from "@/modules/user/repositories/mongo/user/user.repository";
import { HttpStatus, ResponseError } from "@foundation/lib";
import { ExceptionsConstants } from "@/commons/consts/exceptions";
import { departmentRepository } from "@/modules/department/repositories/mongo/department/department.repository";

interface ReportFilterCondition extends Document {
  _conditions: {
    _id: string;
  };
}

export const REPORT_FILTER_SCHEMA = "report-filters";

const ReportFilterSchema: Schema = new Schema(
  {
    _id: { type: Schema.Types.ObjectId, auto: true },
    $schema: { type: String, required: true },
    pages: [{ type: String, required: false }],
    report: { type: Schema.Types.ObjectId, ref: REPORT_SCHEMA },
    customer: { type: Schema.Types.ObjectId, ref: CUSTOMER_SCHEMA },
    target: { type: Schema.Types.ObjectId, ref: TARGET_FILTER_SCHEMA },
    filterType: {
      type: String,
      enum: { values: Object.values(FilterType) },
    },
    operator: {
      type: Schema.Types.Mixed,
      enum: { values: Object.values(FilterOperatorsEnum) },
      required: false,
    },
    values: Schema.Types.Mixed,
    requireSingleSelection: { type: Boolean, required: false },
    displaySettings: {
      isLockedInViewMode: { type: Boolean, required: false },
      isHiddenInViewMode: { type: Boolean, required: false },
      displayName: { type: String, required: false },
    },
    logicalOperator: {
      type: String,
      enum: { values: Object.values(AdvancedFilterLogicalOperatorsEnum) },
      require: false,
    },
    conditions: [
      {
        value: Date,
        operator: {
          type: String,
          enum: { values: Object.values(AdvancedFilterConditionOperatorsEnum) },
          require: false,
        },
      },
    ],
    timeUnitsCount: { type: Number, required: false },
    timeUnitType: {
      type: Number,
      enum: { values: Object.values(RelativeDateFilterTimeUnitEnum) },
      required: false,
    },
    includeToday: { type: Boolean, required: false },
    itemCount: { type: Number, required: false },
    orderBy: {
      table: { type: String, required: false },
      column: { type: String, required: false },
      displayName: { type: String, required: false },
      $schema: { type: String, required: false },
      hierarchy: { type: String, required: false },
      hierarchyLevel: { type: String, required: false },
      measure: { type: String, required: false },
      percentOfGrandTotal: { type: Boolean, required: false },
      aggregationFunction: { type: String, required: false },
    },
  },
  { timestamps: true, discriminatorKey: "filterType", _id: false },
);

ReportFilterSchema.pre("deleteOne", async function (this: ReportFilterCondition) {
  try {
    const reportFilterId = this._conditions._id;

    await userRepository.updateUsersReportFilters(reportFilterId);
    await departmentRepository.updateDepartmentsReportFilters(reportFilterId);
  } catch (err) {
    throw new ResponseError(
      ExceptionsConstants.INTERNAL_SERVER_ERROR,
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
});

export const ReportFilterModel = model(REPORT_FILTER_SCHEMA, ReportFilterSchema);
