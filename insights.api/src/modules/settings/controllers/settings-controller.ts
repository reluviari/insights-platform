import { ConnectMongoDB, Method } from "@foundation/lib";
import { Authorize } from "@/modules/auth/strategies/jwt.strategy";
import { User } from "lib/foundation/methodDecorator";
import { userRepository } from "@/modules/user/repositories/mongo/user/user.repository";
import { tenantRepository } from "@/modules/tenant/repositories/mongo/tenant/tenant.repository";
import { customerRepository } from "@/modules/customer/repositories/mongo/customer/customer.repository";
import { SettingsService } from "../services/settings.service";
import { GetSettingsUseCase } from "../use-cases/get-settings.use-case";
import { ISettingsService } from "../interfaces";
import { reportRepository } from "@/modules/report/repositories/mongo/report/report.repository";
import { GetSettingsDto } from "../dtos";
import { JwtRoles } from "@/modules/auth/roles/jwt.role";
import { Roles } from "@/modules/auth/roles/enums";
import { SessionUser } from "@/commons/interfaces";

export class SettingsController {
  constructor(private settingsService: ISettingsService) {}

  @ConnectMongoDB()
  @Authorize()
  @JwtRoles([Roles.ADMIN])
  @Method()
  public async getSettingsByUser(@User { urlSlug }: SessionUser): Promise<GetSettingsDto> {
    const settings = await this.settingsService.execute(urlSlug);

    return GetSettingsDto.factory(GetSettingsDto, settings);
  }
}

const getSettingsUseCase = new GetSettingsUseCase(
  userRepository,
  tenantRepository,
  customerRepository,
  reportRepository,
);
const settingsService = new SettingsService(getSettingsUseCase);
const settingsController = new SettingsController(settingsService);

export const getSettingsByUser = settingsController.getSettingsByUser.bind(settingsController);
