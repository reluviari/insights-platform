import { ExceptionsConstants } from "@/commons/consts/exceptions";
import { IUserRepository } from "@/modules/user/interfaces";
import * as jwt from "jsonwebtoken";
import { SignInDto } from "../dtos";
import { ScopeEnum } from "../enums";
import { HttpStatus, ResponseError } from "@foundation/lib";
import { DecodedAccessToken } from "../interfaces";
import { hashCompareSync } from "@/utils/hash-compare";
import { isValidUrlSlug } from "@/utils/valid-url-slug";

export class SignInUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(body: SignInDto) {
    const { email: userEmail, password, urlSlug } = body;

    if (
      typeof userEmail !== "string" ||
      typeof password !== "string" ||
      !userEmail.trim() ||
      password.length === 0
    ) {
      throw new ResponseError(ExceptionsConstants.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
    }

    if (!urlSlug || typeof urlSlug !== "string") {
      throw new ResponseError(ExceptionsConstants.ORIGIN_NOT_PROVIDED, HttpStatus.BAD_REQUEST);
    }

    if (!isValidUrlSlug(urlSlug)) {
      throw new ResponseError(ExceptionsConstants.INVALID_URL_SLUG, HttpStatus.BAD_REQUEST);
    }

    const normalizedEmail = userEmail.normalize("NFKC").trim().toLowerCase();

    const user = await this.userRepository.findUserByEmail(normalizedEmail, undefined, true);

    if (!user) {
      throw new ResponseError(ExceptionsConstants.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
    }

    if (!user.isActive) {
      throw new ResponseError(ExceptionsConstants.INACTIVE_USER, HttpStatus.BAD_REQUEST);
    }

    const validatePassword = hashCompareSync(password, user.password);

    if (!validatePassword) {
      throw new ResponseError(ExceptionsConstants.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
    }

    const { _id, name, email, roles } = user;
    const accessToken = jwt.sign(
      {
        id: _id,
        name,
        urlSlug,
        email,
        roles,
        scope: [ScopeEnum.USER_ACCESS_TOKEN],
      },
      String(process.env.SECRET_TOKEN),
      {
        expiresIn: String(process.env.SECRET_TOKEN_EXPIRE),
      },
    );
    const payload = jwt.decode(accessToken);
    const { iat: createdTokenAt, roles: userRoles } = payload as DecodedAccessToken;

    await this.userRepository.update({ id: _id }, { createdTokenAt });

    return { accessToken, userRoles };
  }
}
