import { ExceptionsConstants } from "@/commons/consts/exceptions";
import { IUserRepository } from "@/modules/user/interfaces";

import { SignInDto } from "../dtos";
import { HttpStatus, ResponseError } from "@foundation/lib";
import { Customer } from "@/modules/customer/entities";
import { keycloakError } from "@/commons/errors/keycloak-error";
import { keycloakApi } from "@/utils/keycloak-api";
import { ITenantRepository } from "@/modules/tenant/interfaces/tenant.repository.interface";

interface KeycloakAuthResponse {
  access_token: string;
  refresh_token: string;
}

export class KeycloakSignInUseCase {
  private readonly populateUses = [
    {
      path: "customer",
    },
  ];

  constructor(
    private userRepository: IUserRepository,
    private tenantRepository: ITenantRepository,
  ) {}

  async execute(body: SignInDto) {
    const { email, password, urlSlug } = body;
    const user = await this.userRepository.findUserByEmail(email, this.populateUses);
    const tenant = await this.tenantRepository.findBySlug(urlSlug);

    if (!user) {
      throw new ResponseError(ExceptionsConstants.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
    }

    if (!user.isActive) {
      throw new ResponseError(ExceptionsConstants.INACTIVE_USER, HttpStatus.BAD_REQUEST);
    }

    const customer = user?.customer as Customer;

    const data = new URLSearchParams({
      grant_type: "password",
      client_id: customer?.clientId || user.clientId,
      username: email,
      password,
    });

    try {
      const response = await keycloakApi.post<KeycloakAuthResponse>(
        `/realms/${tenant.realmId}/protocol/openid-connect/token`,
        data,
      );

      const currentTimeInSeconds = Math.floor(new Date().getTime() / 1000);
      await this.userRepository.update({ id: user._id }, { createdTokenAt: currentTimeInSeconds });

      return { accessToken: response.data.access_token, refreshToken: response.data.refresh_token };
    } catch (err) {
      keycloakError(err);
    }
  }
}
