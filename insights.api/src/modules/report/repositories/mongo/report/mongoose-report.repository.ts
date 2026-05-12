import { ReportModel } from "./report.schema";
import { toReport } from "../utils";
import { IReportRepository, WhereReport } from "@/modules/report/interfaces";
import { Report } from "@/modules/report/entities";
import { HttpStatus, ResponseError } from "@foundation/lib";
import { ExceptionsConstants } from "@/commons/consts/exceptions";
import { updateReportRequestType } from "@/modules/report/types";
import { TenantModel } from "@/modules/tenant/repositories/mongo/tenant/tenant.schema";
import { filterUndefinedFields } from "@/utils/filter-undefined-fields";
import { PopulateOptions } from "@/commons/interfaces";

export class MongooseReportRepository implements IReportRepository {
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

  async createMany(data: Report[]): Promise<Report[]> {
    const reportDocs = await this.handleErrors(ReportModel.insertMany(data));
    return reportDocs.length
      ? reportDocs.map(reportDoc => {
          return toReport(reportDoc.toObject());
        })
      : [];
  }

  async create(data: Report): Promise<Report> {
    const reportDoc = await this.handleErrors(ReportModel.create(data));
    return reportDoc ? toReport(reportDoc.toObject()) : null;
  }

  async findById(id: string, populates?: PopulateOptions[]): Promise<Report | null> {
    const reportDoc = await this.handleErrors(ReportModel.findById(id).populate(populates).exec());
    return reportDoc ? toReport(reportDoc.toObject()) : null;
  }

  async findByIdAndTenantId(
    id: string,
    tenantId: string,
    populates?: PopulateOptions[],
  ): Promise<Report | null> {
    const reportDoc = await this.handleErrors(
      ReportModel.findOne({ _id: id, tenant: tenantId }).populate(populates).exec(),
    );
    return reportDoc ? toReport(reportDoc.toObject()) : null;
  }

  async findByExternalId(externalId: string): Promise<Report | null> {
    const reportDoc = await this.handleErrors(ReportModel.findOne({ externalId }).exec());
    return reportDoc ? toReport(reportDoc.toObject()) : null;
  }

  async update(id: string, data: updateReportRequestType): Promise<Report | null> {
    const reportDoc = await this.handleErrors(
      ReportModel.findOneAndUpdate({ _id: id }, { $set: data }),
    );

    return reportDoc ? toReport(reportDoc.toObject()) : null;
  }

  async updateByIdAndTenantId(
    id: string,
    tenantId: string,
    data: updateReportRequestType,
  ): Promise<Report | null> {
    const reportDoc = await this.handleErrors(
      ReportModel.findOneAndUpdate({ _id: id, tenant: tenantId }, { $set: data }),
    );

    return reportDoc ? toReport(reportDoc.toObject()) : null;
  }

  async findReportsByTenantSlug(urlSlug: string): Promise<Report[] | null> {
    const tenant = await this.handleErrors(
      TenantModel.findOne({ urlSlug: urlSlug.replace("http://", "https://") }),
    );
    if (!tenant) {
      throw new ResponseError(ExceptionsConstants.TENANT_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    const reportDocs = await this.handleErrors(
      ReportModel.find({ tenant: tenant._id }).populate("tenant").exec(),
    );

    const reports = reportDocs.length
      ? reportDocs.map(reportDoc => {
          return toReport(reportDoc.toObject());
        })
      : [];

    return reports;
  }

  async listAll(where: WhereReport, page?: number, limit?: number): Promise<Report[]> {
    const pageNumber = page ? page - 1 : 0;
    const skipAmount = pageNumber * limit;

    const reportDocs = await this.handleErrors(
      ReportModel.find(filterUndefinedFields(where)).skip(skipAmount).limit(limit).exec(),
    );

    return reportDocs.length ? reportDocs.map(reportDoc => toReport(reportDoc.toObject())) : [];
  }

  async count(where: WhereReport): Promise<number> {
    const count = await this.handleErrors(ReportModel.count(filterUndefinedFields(where)).exec());

    return count || 0;
  }

  async findByExternalIdAndTenantId(externalId: string, tenantId: string): Promise<Report | null> {
    const reportDoc = await this.handleErrors(
      ReportModel.findOne({ externalId, tenant: tenantId }).exec(),
    );
    return reportDoc ? toReport(reportDoc.toObject()) : null;
  }
}
