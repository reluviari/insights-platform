import { ResponseError } from "@foundation/lib";
import { ExceptionsConstants } from "@/commons/consts/exceptions";
import { HttpStatus } from "@foundation/lib";
import { IReportRepository } from "@/modules/report/interfaces";

export async function checkReportExist(reportId: string, reportRepository: IReportRepository) {
  const report = await reportRepository.findById(reportId);

  if (!report) {
    throw new ResponseError(ExceptionsConstants.REPORT_NOT_FOUND, HttpStatus.NOT_FOUND);
  }
  return report;
}
