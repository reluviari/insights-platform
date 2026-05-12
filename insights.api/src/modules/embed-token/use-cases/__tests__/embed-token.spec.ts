import { EmbedTokenUseCase } from "../embed-token";
import { Roles } from "@/modules/auth/roles/enums";
import { IUserRepository } from "@/modules/user/interfaces";
import { IReportRepository } from "@/modules/report/interfaces";
import { IDepartmentRepository } from "@/modules/department/interfaces";
import { ITokenIntegration } from "../../interfaces";
import { HttpStatus } from "@foundation/lib";
import { ExceptionsConstants } from "@/commons/consts/exceptions";

describe("EmbedTokenUseCase", () => {
  const tenantId = "507f191e810c19729de860f1";
  const userId = "507f191e810c19729de860e3";
  const reportId = "507f191e810c19729de860a1";

  let userRepository: jest.Mocked<Pick<IUserRepository, "findUserByIdAndTenantId">>;
  let reportRepository: jest.Mocked<Pick<IReportRepository, "findByExternalIdAndTenantId">>;
  let departmentRepository: jest.Mocked<Pick<IDepartmentRepository, "findById">>;
  let tokenIntegration: jest.Mocked<Pick<ITokenIntegration, "getPBIEmbedToken">>;
  let useCase: EmbedTokenUseCase;

  beforeEach(() => {
    userRepository = {
      findUserByIdAndTenantId: jest.fn(),
    };
    reportRepository = {
      findByExternalIdAndTenantId: jest.fn(),
    };
    departmentRepository = {
      findById: jest.fn(),
    };
    tokenIntegration = {
      getPBIEmbedToken: jest.fn().mockResolvedValue("embed-token"),
    };

    useCase = new EmbedTokenUseCase(
      userRepository as unknown as IUserRepository,
      reportRepository as unknown as IReportRepository,
      departmentRepository as unknown as IDepartmentRepository,
      tokenIntegration as unknown as ITokenIntegration,
    );
  });

  it("gera token apenas depois de validar usuário e report no tenant", async () => {
    userRepository.findUserByIdAndTenantId.mockResolvedValue({
      _id: userId,
      name: "Dev",
      email: "dev@example.com",
      roles: [Roles.ADMIN],
      isActive: true,
      status: true,
      phone: "",
      tenants: [tenantId],
      departments: [],
      reports: [],
      reportFilters: [],
    });
    reportRepository.findByExternalIdAndTenantId.mockResolvedValue({
      _id: reportId,
      externalId: "report-external-id",
      title: "Report",
      tenant: tenantId,
      isActive: true,
    });

    const result = await useCase.execute(
      { id: userId, tenantId, roles: [Roles.ADMIN] },
      { externalId: "report-external-id", workspaceId: "workspace-from-client" },
    );

    expect(userRepository.findUserByIdAndTenantId).toHaveBeenCalledWith(
      userId,
      tenantId,
      expect.any(Array),
    );
    expect(reportRepository.findByExternalIdAndTenantId).toHaveBeenCalledWith(
      "report-external-id",
      tenantId,
    );
    expect(tokenIntegration.getPBIEmbedToken).toHaveBeenCalledWith({
      externalId: "report-external-id",
      workspaceId: "workspace-from-client",
    });
    expect(result).toEqual({ token: "embed-token", reportFilters: [] });
  });

  it("não chama Power BI quando report não pertence ao tenant", async () => {
    userRepository.findUserByIdAndTenantId.mockResolvedValue({
      _id: userId,
      name: "Dev",
      email: "dev@example.com",
      roles: [Roles.ADMIN],
      isActive: true,
      status: true,
      phone: "",
      tenants: [tenantId],
      departments: [],
      reports: [],
      reportFilters: [],
    });
    reportRepository.findByExternalIdAndTenantId.mockResolvedValue(null);

    await expect(
      useCase.execute(
        { id: userId, tenantId, roles: [Roles.ADMIN] },
        { externalId: "other-report", workspaceId: "workspace-from-client" },
      ),
    ).rejects.toMatchObject({
      statusCode: HttpStatus.NOT_FOUND,
      message: ExceptionsConstants.REPORT_NOT_FOUND,
    });

    expect(tokenIntegration.getPBIEmbedToken).not.toHaveBeenCalled();
  });

  it("não chama Power BI quando usuário não tem acesso ao report", async () => {
    userRepository.findUserByIdAndTenantId.mockResolvedValue({
      _id: userId,
      name: "Dev",
      email: "dev@example.com",
      roles: ["USER"],
      isActive: true,
      status: true,
      phone: "",
      tenants: [tenantId],
      departments: [],
      reports: [],
      reportFilters: [],
    });
    reportRepository.findByExternalIdAndTenantId.mockResolvedValue({
      _id: reportId,
      externalId: "report-external-id",
      title: "Report",
      tenant: tenantId,
      isActive: true,
    });

    await expect(
      useCase.execute(
        { id: userId, tenantId, roles: ["USER"] },
        { externalId: "report-external-id", workspaceId: "workspace-from-client" },
      ),
    ).rejects.toMatchObject({ statusCode: HttpStatus.UNAUTHORIZED });

    expect(tokenIntegration.getPBIEmbedToken).not.toHaveBeenCalled();
  });

  it("retorna filtros e páginas do departamento apenas para o report autorizado", async () => {
    userRepository.findUserByIdAndTenantId.mockResolvedValue({
      _id: userId,
      name: "Dev",
      email: "dev@example.com",
      roles: ["USER"],
      isActive: true,
      status: true,
      phone: "",
      tenants: [tenantId],
      departments: ["department-a"],
      reports: [],
      reportFilters: [
        {
          _id: "user-filter",
          report: reportId,
          target: { _id: "target-a", report: reportId, table: "Table", column: "Column" },
          filterType: undefined,
        } as any,
      ],
    });
    reportRepository.findByExternalIdAndTenantId.mockResolvedValue({
      _id: reportId,
      externalId: "report-external-id",
      title: "Report",
      tenant: tenantId,
      isActive: true,
    });
    departmentRepository.findById.mockResolvedValue({
      _id: "department-a",
      title: "Department",
      customer: "customer-a",
      reports: [reportId],
      reportPages: [
        { reportId, name: "Page 1", visible: true },
        { reportId: "other-report", name: "Other", visible: true },
      ],
      reportFilters: [
        {
          _id: "department-filter",
          report: reportId,
          target: { _id: "target-b", report: reportId, table: "Table", column: "Other" },
          filterType: undefined,
        } as any,
        {
          _id: "other-filter",
          report: "other-report",
          target: { _id: "target-c", report: "other-report", table: "Table", column: "Other" },
          filterType: undefined,
        } as any,
      ],
    } as any);

    const result = await useCase.execute(
      { id: userId, tenantId, roles: ["USER"] },
      { externalId: "report-external-id", workspaceId: "workspace-from-client" },
    );

    expect(result.reportFilters).toEqual([
      {
        _id: "user-filter",
        report: reportId,
        target: { _id: "target-a", report: reportId, table: "Table", column: "Column" },
        filterType: undefined,
      },
      {
        _id: "department-filter",
        report: reportId,
        target: { _id: "target-b", report: reportId, table: "Table", column: "Other" },
        filterType: undefined,
      },
    ]);
    expect(result.reportPages).toEqual([{ reportId, name: "Page 1", visible: true }]);
  });
});
