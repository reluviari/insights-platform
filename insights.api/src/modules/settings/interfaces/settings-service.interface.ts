import { GetSettingsDto } from "../dtos";

export interface ISettingsService {
  execute(urlSlug: string): Promise<GetSettingsDto>;
}
