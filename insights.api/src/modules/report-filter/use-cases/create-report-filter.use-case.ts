import { IReportRepository } from "@/modules/report/interfaces";
import { CreateReportFilterDto } from "../dtos";
import { ReportFilter } from "../entities";
import { IReportFilterRepository } from "../interfaces";
import { HttpStatus, ResponseError } from "@foundation/lib";
import { ExceptionsConstants } from "@/commons/consts/exceptions";
import { Types } from "mongoose";
import { ITargetFilterRepository } from "@/modules/target-filter/interfaces";

export class CreateReportFilterUseCase {
  constructor(
    private reportFilterRepository: IReportFilterRepository,
    private reportRepository: IReportRepository,
    private targetFilterRepository: ITargetFilterRepository,
  ) {}

  async execute(
    reportId: string,
    customerId: string,
    data: CreateReportFilterDto,
  ): Promise<ReportFilter> {
    const isObjectIdValid = Types.ObjectId.isValid(reportId);
    if (!isObjectIdValid) {
      throw new ResponseError(ExceptionsConstants.INVALID_OBJECT_ID, HttpStatus.BAD_REQUEST);
    }

    const report = await this.reportRepository.findById(reportId);
    if (!report) {
      throw new ResponseError(ExceptionsConstants.REPORT_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    const target = await this.targetFilterRepository.findById(data.targetId);

    if (!target) {
      throw new ResponseError(ExceptionsConstants.TARGET_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    return this.reportFilterRepository.create({
      ...data,
      target: target._id,
      report: reportId,
      customer: customerId,
    });
  }
}
