import { Document, Schema, model } from "mongoose";
import { REPORT_SCHEMA } from "@/modules/report/repositories/mongo/report/report.schema";
import { reportFilterRepository } from "@/modules/report-filter/repositories/mongo/report-filter/report-filter.repository";
import { HttpStatus, ResponseError } from "@foundation/lib";
import { ExceptionsConstants } from "@/commons/consts/exceptions";

export const TARGET_FILTER_SCHEMA = "target-filters";

interface TargetCondition extends Document {
  _conditions: {
    _id: string;
  };
}
const TargetFilterSchema: Schema = new Schema(
  {
    _id: { type: Schema.Types.ObjectId, auto: true },
    table: { type: String, required: true },
    column: { type: String, required: true },
    displayName: { type: String, required: false },
    report: { type: Schema.Types.ObjectId, ref: REPORT_SCHEMA },
  },
  { timestamps: true, _id: false },
);

TargetFilterSchema.pre("deleteOne", async function (this: TargetCondition) {
  try {
    const targetFilterId = this._conditions._id;

    const reportFilters = await reportFilterRepository.listByTargetFilterId(targetFilterId);

    await Promise.all(
      reportFilters.map(reportFilter => reportFilterRepository.delete(reportFilter._id)),
    );
  } catch (err) {
    throw new ResponseError(
      ExceptionsConstants.INTERNAL_SERVER_ERROR,
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
});

export const TargetFilterModel = model(TARGET_FILTER_SCHEMA, TargetFilterSchema);
