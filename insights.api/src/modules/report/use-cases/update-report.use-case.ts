import { HttpStatus, ResponseError } from "@foundation/lib";
import { IReportRepository } from "../interfaces";
import { Types } from "mongoose";
import { ExceptionsConstants } from "@/commons/consts/exceptions";
import { updateReportRequestType } from "../types";
export class UpdateReportUseCase {
  constructor(private updateReportRepository: IReportRepository) {}

  async execute(reportId: string, data: updateReportRequestType) {
    const isObjectIdValid = Types.ObjectId.isValid(reportId);

    if (!isObjectIdValid) {
      throw new ResponseError(ExceptionsConstants.INVALID_OBJECT_ID, HttpStatus.BAD_REQUEST);
    }

    const reportDoc = await this.updateReportRepository.update(reportId, data);

    if (!reportDoc) {
      throw new ResponseError(ExceptionsConstants.REPORT_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    return reportDoc;
  }
}
