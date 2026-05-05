import { Report } from "../entities";
import { HttpStatus, ResponseError } from "@foundation/lib";
import { ExceptionsConstants } from "@/commons/consts/exceptions";
import { IReportRepository } from "../interfaces";
import { ITenantRepository } from "@/modules/tenant/interfaces/tenant.repository.interface";
import { isValidUrlSlug } from "@/utils/valid-url-slug";

export class GetReportByTenantSlugUseCase {
  constructor(
    private reportRepository: IReportRepository,
    private tenantRepository: ITenantRepository,
  ) {}

  async execute(urlSlug: string): Promise<Report[] | null> {
    if (!urlSlug || typeof urlSlug !== "string") {
      throw new ResponseError(ExceptionsConstants.ORIGIN_NOT_PROVIDED, HttpStatus.BAD_REQUEST);
    }

    if (!isValidUrlSlug(urlSlug)) {
      throw new ResponseError(ExceptionsConstants.INVALID_URL_SLUG, HttpStatus.BAD_REQUEST);
    }

    const tenant = await this.tenantRepository.findBySlug(urlSlug);

    if (!tenant) {
      throw new ResponseError(ExceptionsConstants.TENANT_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    const reports = await this.reportRepository.findReportsByTenantSlug(urlSlug);

    return reports;
  }
}
