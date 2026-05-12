import { ExceptionsConstants } from "@/commons/consts/exceptions";
import { IDepartmentRepository } from "@/modules/department/interfaces";
import { ReportPageType } from "@/modules/department/types";
import { ReportFilter } from "@/modules/report-filter/entities";
import { IReportRepository } from "@/modules/report/interfaces";
import { Roles } from "@/modules/auth/roles/enums";
import { IUserRepository } from "@/modules/user/interfaces";
import { includesObjectId, objectIdToString, sameObjectId } from "@/utils/object-id";
import { HttpStatus, ResponseError } from "@foundation/lib";
import { ITokenIntegration } from "../interfaces";
import { EmbedTokenInputType } from "../types/embed-token-input.type";
import { EmbedTokenOutputType } from "../types/embed-token-output.type";

export class EmbedTokenUseCase {
  private readonly populateUses = [{ path: "reportFilters", populate: { path: "target" } }];
  private readonly populateDepartment = [{ path: "reportFilters", populate: { path: "target" } }];

  constructor(
    private userRepository: IUserRepository,
    private reportRepository: IReportRepository,
    private departmentRepository: IDepartmentRepository,
    private tokenIntegration: ITokenIntegration,
  ) {}

  async execute(
    sessionUser: { id: string; tenantId: string; roles?: string[] },
    { externalId, workspaceId }: EmbedTokenInputType,
  ): Promise<EmbedTokenOutputType> {
    const user = await this.findUser(sessionUser.id, sessionUser.tenantId);
    const report = await this.findReport(externalId, sessionUser.tenantId);

    if (!report) {
      throw new ResponseError(ExceptionsConstants.REPORT_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    this.validateReportAccess(sessionUser.roles ?? [], user, report._id);

    const embedToken = await this.findEmbedToken({ externalId: report.externalId, workspaceId });
    const departments = (user.departments as string[]) ?? [];

    if (departments.length) {
      const { departmentWithReportFilters, reportPages } = await this.findReportsFromDepartments(
        departments,
        report._id,
      );
      const userReportFilters = this.filterReportFilters(
        user.reportFilters as ReportFilter[],
        report._id,
      );
      const departmentReportFilters = this.filterReportFilters(
        departmentWithReportFilters,
        report._id,
      );
      const combinedReportFilters = this.combineUniqueReportFilters(
        userReportFilters,
        departmentReportFilters,
      );

      return {
        token: embedToken,
        reportFilters: combinedReportFilters,
        reportPages: this.getUniqueReportPages(reportPages),
      };
    }

    return {
      token: embedToken,
      reportFilters: this.filterReportFilters(user.reportFilters as ReportFilter[], report._id),
    };
  }

  private validateReportAccess(roles: string[], user, reportId: string) {
    if (roles.includes(Roles.ADMIN)) {
      return;
    }

    if (includesObjectId(user.reports as unknown[], reportId)) {
      return;
    }

    if ((user.departments as unknown[])?.length) {
      return;
    }

    throw new ResponseError(ExceptionsConstants.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
  }

  private async findReportsFromDepartments(
    departmentIds: string[],
    reportId: string,
  ): Promise<{
    reportPages: ReportPageType[];
    departmentWithReportFilters: ReportFilter[];
  }> {
    const departments = await Promise.all(departmentIds.map(id => this.findDepartment(id)));

    const reportPages = departments
      .flatMap(department => department?.reportPages ?? [])
      .filter(reportPage => sameObjectId(reportPage.reportId, reportId));

    const departmentWithReportFilters = departments.flatMap(
      department => (department?.reportFilters as ReportFilter[]) ?? [],
    );

    return { reportPages, departmentWithReportFilters };
  }

  private async findEmbedToken(body: EmbedTokenInputType): Promise<string> {
    return this.tokenIntegration.getPBIEmbedToken(body);
  }

  private async findUser(userId: string, tenantId: string) {
    const user = await this.userRepository.findUserByIdAndTenantId(
      userId,
      tenantId,
      this.populateUses,
    );

    if (!user) {
      throw new ResponseError(ExceptionsConstants.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    return user;
  }

  private async findReport(externalId: string, tenantId: string) {
    return this.reportRepository.findByExternalIdAndTenantId(externalId, tenantId);
  }

  private async findDepartment(departmentId: string) {
    return this.departmentRepository.findById(departmentId, this.populateDepartment);
  }

  private filterReportFilters(filters: ReportFilter[] = [], reportId: string): ReportFilter[] {
    return filters.filter(filter => sameObjectId(filter.report, reportId));
  }

  private combineUniqueReportFilters(
    userFilters: ReportFilter[],
    departmentFilters: ReportFilter[],
  ): ReportFilter[] {
    const allFilters = [...userFilters, ...departmentFilters];
    const ids = new Set<string>();

    return allFilters.filter(filter => {
      const id = objectIdToString(filter._id);
      const isUnique = Boolean(id && !ids.has(id));
      if (isUnique) ids.add(id);
      return isUnique;
    });
  }

  private getUniqueReportPages(reportPages: ReportPageType[]): ReportPageType[] {
    return Object.values(
      reportPages.reduce((acc, obj) => {
        if (!acc[obj.name] || (acc[obj.name] && !acc[obj.name].visible && obj.visible)) {
          acc[obj.name] = obj;
        }
        return acc;
      }, {}),
    );
  }
}
