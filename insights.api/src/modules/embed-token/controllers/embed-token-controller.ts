import { Body, ConnectMongoDB, Method, User } from "@foundation/lib";
import { ITokenService } from "../interfaces/token-service.interface";
import { EmbedTokenService } from "../services/token.service";
import { EmbedTokenUseCase } from "../use-cases/embed-token";
import { userRepository } from "@/modules/user/repositories/mongo/user/user.repository";
import { reportRepository } from "@/modules/report/repositories/mongo/report/report.repository";
import { departmentRepository } from "@/modules/department/repositories/mongo/department/department.repository";
import { PBIEmbedTokenIntegration } from "../providers/integrations";
import { EmbedTokenRequestDTO, EmbedTokenResponseDTO } from "../dtos";
import { Authorize } from "@/modules/auth/strategies/jwt.strategy";
import { SessionUser } from "@/commons/interfaces";

export class EmbedTokenController {
  constructor(private tokenService: ITokenService) {}

  @ConnectMongoDB()
  @Authorize()
  @Method()
  public async embedToken(
    @Body(EmbedTokenRequestDTO) body: EmbedTokenRequestDTO,
    @User { id }: SessionUser,
  ): Promise<EmbedTokenResponseDTO> {
    const data = await this.tokenService.embedToken(id, body);

    return EmbedTokenResponseDTO.factory(EmbedTokenResponseDTO, data);
  }
}

const integration = new PBIEmbedTokenIntegration();
const useCase = new EmbedTokenUseCase(
  userRepository,
  reportRepository,
  departmentRepository,
  integration,
);
const service = new EmbedTokenService(useCase);
const controller = new EmbedTokenController(service);

export const embedToken = controller.embedToken.bind(controller);
