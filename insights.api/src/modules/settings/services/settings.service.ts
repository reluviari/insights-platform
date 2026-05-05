import { GetSettingsDto } from "../dtos";
import { ISettingsService } from "../interfaces";
import { GetSettingsUseCase } from "../use-cases/get-settings.use-case";

export class SettingsService implements ISettingsService {
  constructor(private getSettingsUseCase: GetSettingsUseCase) {}

  async execute(urlSlug: string): Promise<GetSettingsDto> {
    return this.getSettingsUseCase.execute(urlSlug);
  }
}
