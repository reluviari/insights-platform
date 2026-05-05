import { ReportFilterModel } from "./report-filter.schema";
import {
  CreateReportFilter,
  IReportFilterRepository,
  WhereReportFilter,
} from "@/modules/report-filter/interfaces";
import { ReportFilter } from "@/modules/report-filter/entities";
import { HttpStatus, ResponseError } from "@foundation/lib";
import { ExceptionsConstants } from "@/commons/consts/exceptions";
import { toReportFilter } from "../utils";
import { PopulateOptions } from "@/commons/interfaces";
import { filterUndefinedFields } from "@/utils/filter-undefined-fields";

export class MongooseReportFilterRepository implements IReportFilterRepository {
  private async handleErrors<T>(promise: Promise<T>): Promise<T> {
    try {
      return await promise;
    } catch (error) {
      throw new ResponseError(
        ExceptionsConstants.INTERNAL_SERVER_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findById(id: string): Promise<ReportFilter | null> {
    const reportFilterDoc = await this.handleErrors(ReportFilterModel.findById(id).exec());

    return reportFilterDoc ? toReportFilter(reportFilterDoc.toObject()) : null;
  }

  async listByReportId(
    reportId: string,
    populates?: PopulateOptions[],
  ): Promise<ReportFilter[] | null> {
    const reportFilterDocs = await this.handleErrors(
      ReportFilterModel.find({ report: reportId }).populate(populates).exec(),
    );

    return reportFilterDocs.length
      ? reportFilterDocs.map(reportFilterDoc => toReportFilter(reportFilterDoc.toObject()))
      : [];
  }

  async listByTargetFilterId(
    targetFilterId: string,
    populates?: PopulateOptions[],
  ): Promise<ReportFilter[]> {
    const reportFilterDocs = await this.handleErrors(
      ReportFilterModel.find({ target: targetFilterId }).populate(populates).exec(),
    );

    return reportFilterDocs.length
      ? reportFilterDocs.map(reportFilterDoc => toReportFilter(reportFilterDoc.toObject()))
      : [];
  }

  async listAll(where?: WhereReportFilter, populates?: PopulateOptions[]): Promise<ReportFilter[]> {
    const reportFilterDocs = await this.handleErrors(
      ReportFilterModel.find(filterUndefinedFields({ target: where?.targetFilterId, ...where }))
        .populate(populates)
        .exec(),
    );

    return reportFilterDocs.length
      ? reportFilterDocs.map(reportFilterDoc => toReportFilter(reportFilterDoc.toObject()))
      : [];
  }

  async delete(id: string): Promise<void> {
    await this.handleErrors(ReportFilterModel.deleteOne({ _id: id }));
  }

  async create(data: CreateReportFilter): Promise<ReportFilter> {
    const newReportFilterDoc = await this.handleErrors(ReportFilterModel.create(data));

    return toReportFilter(newReportFilterDoc.toObject());
  }

  async update(id: string, data: any): Promise<ReportFilter | null> {
    const updateReportFilterDoc = await this.handleErrors(
      ReportFilterModel.findByIdAndUpdate({ _id: id }, { $set: data }),
    );

    return updateReportFilterDoc ? toReportFilter(updateReportFilterDoc) : null;
  }

  async createMany(data: CreateReportFilter[]): Promise<ReportFilter[]> {
    const reportFilterDocs = await this.handleErrors(ReportFilterModel.insertMany(data));
    return reportFilterDocs.length
      ? reportFilterDocs.map(reportFilterDoc => {
          return toReportFilter(reportFilterDoc.toObject());
        })
      : [];
  }
}
