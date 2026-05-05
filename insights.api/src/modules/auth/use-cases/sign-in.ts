import { ExceptionsConstants } from "@/commons/consts/exceptions";
import { IUserRepository } from "@/modules/user/interfaces";
import jwt, { SignOptions } from "jsonwebtoken";
import { SignInDto } from "../dtos";
import { ScopeEnum } from "../enums";
import { HttpStatus, ResponseError } from "@foundation/lib";
import { DecodedAccessToken } from "../interfaces";
import { hashCompareSync } from "@/utils/hash-compare";
import { isValidUrlSlug } from "@/utils/valid-url-slug";

function signInVerbose(reason: string): void {
  if (process.env.INSIGHTS_AUTH_VERBOSE === "1") {
    console.warn(`[auth/sign-in] ${reason}`);
  }
}

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
      signInVerbose("rejected: missing_email_or_password");
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
      signInVerbose("rejected: user_not_found (same DB as MONGODB_URI?)");
      throw new ResponseError(ExceptionsConstants.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
    }

    if (!user.isActive) {
      throw new ResponseError(ExceptionsConstants.INACTIVE_USER, HttpStatus.BAD_REQUEST);
    }

    const validatePassword = hashCompareSync(password, user.password);

    if (!validatePassword) {
      signInVerbose(
        "rejected: password_mismatch_or_missing_hash (re-run seed / npm run verify:dev-login-data)",
      );
      throw new ResponseError(ExceptionsConstants.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
    }

    const { _id, name, email, roles } = user;

    const jwtSignOptions: SignOptions = {
      expiresIn: (process.env.SECRET_TOKEN_EXPIRE ?? "24h") as SignOptions["expiresIn"],
    };

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
      jwtSignOptions,
    );
    const payload = jwt.decode(accessToken);
    const { iat: createdTokenAt, roles: userRoles } = payload as DecodedAccessToken;

    await this.userRepository.update({ id: _id }, { createdTokenAt });

    return { accessToken, userRoles };
  }
}
