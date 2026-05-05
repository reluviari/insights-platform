import { IUserRepository } from "@/modules/user/interfaces";
import { ITokenIntegration } from "../interfaces";
import { EmbedTokenInputType } from "../types/embed-token-input.type";
import { EmbedTokenOutputType } from "../types/embed-token-output.type";
import { IDepartmentRepository } from "@/modules/department/interfaces";
import { ReportFilter } from "@/modules/report-filter/entities";
import { IReportRepository } from "@/modules/report/interfaces";
import { ReportPageType } from "@/modules/department/types";

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
    userId: string,
    { externalId, workspaceId }: EmbedTokenInputType,
  ): Promise<EmbedTokenOutputType> {
    const [embedToken, user] = await Promise.all([
      this.findEmbedToken({ externalId, workspaceId }),
      this.findUser(userId),
    ]);

    const report = await this.findReport(externalId, user.tenants[0].toString());
    const departments = user.departments as string[];

    if (departments.length) {
      const { departmentWithReportFilters, reportPages } = await this.findReportsFromDepartments(
        departments,
        report._id,
      );
      const departmentReportFilters = departmentWithReportFilters.filter(
        filter => filter.report === report._id,
      );

      return { token: embedToken, reportFilters: departmentReportFilters, reportPages };
    }

    return { token: embedToken, reportFilters: [] };
  }

  private async findReportsFromDepartments(
    departmentIds: string[],
    reportId: string,
  ): Promise<{
    reportPages: ReportPageType[];
    departmentWithReportFilters: ReportFilter[];
  }> {
    const departments = await Promise.all(departmentIds.map(id => this.findDepartment(id)));

    const reportPages = departments.flatMap(department => department.reportPages);
    const filterReportPages = reportPages.filter(f => f.reportId === reportId);

    const departmentWithReportFilters = departments.flatMap(
      department => department.reportFilters as ReportFilter[],
    );

    return { reportPages: filterReportPages, departmentWithReportFilters };
  }

  private async findEmbedToken(body: EmbedTokenInputType): Promise<string> {
    return this.tokenIntegration.getPBIEmbedToken(body);
  }

  private async findUser(userId: string) {
    return this.userRepository.findUserById(userId, this.populateUses);
  }

  private async findReport(externalId: string, tenantId: string) {
    return await this.reportRepository.findByExternalIdAndTenantId(externalId, tenantId);
  }

  private async findDepartment(departmentId: string) {
    return this.departmentRepository.findById(departmentId, this.populateDepartment);
  }

  private embedTokenWithReportFilters(
    embedToken: string,
    userReportFilters: ReportFilter[],
    departmentReportFilters: ReportFilter[],
  ): EmbedTokenOutputType {
    const combinedReportFilters = this.combineUniqueReportFilters(
      userReportFilters,
      departmentReportFilters,
    );
    return { token: embedToken, reportFilters: combinedReportFilters };
  }

  private combineUniqueReportFilters(
    userFilters: ReportFilter[],
    departmentFilters: ReportFilter[],
  ): ReportFilter[] {
    const allFilters = [...userFilters, ...departmentFilters];
    const uniqueFilters = this.getUniqueFilters(allFilters);
    return uniqueFilters;
  }

  private getUniqueFilters(filters: ReportFilter[]): ReportFilter[] {
    const ids = new Set();
    return filters.filter(filter => {
      const isUnique = !ids.has(filter._id);
      if (isUnique) ids.add(filter._id);
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
