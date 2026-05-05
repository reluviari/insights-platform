import { IUserRepository } from "@/modules/user/interfaces";
import { IResponseValidateToken } from "@/modules/auth/dtos/token-validate";

export class ValidateTokenUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(jwtToken: string): Promise<IResponseValidateToken> {
    const user = await this.userRepository.findUserByPasswordToken(jwtToken);

    if (user) {
      return {
        valid: true,
      };
    }

    return {
      valid: false,
    };
  }
}
