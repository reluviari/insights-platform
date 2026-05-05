import jwt, { JsonWebTokenError, NotBeforeError, TokenExpiredError } from "jsonwebtoken";
import { HttpStatus, ResponseError } from "@foundation/lib";
import { ExceptionsConstants } from "@/commons/consts/exceptions";
import { hashSync } from "@/utils/hash-sync";
import { IUserRepository } from "@/modules/user/interfaces";
import { DecodedAccessToken } from "@/modules/auth/interfaces";
import { ScopeEnum } from "../enums";
import { DefinePasswordDto } from "../dtos";

export class DefinePasswordUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(body: DefinePasswordDto) {
    const { token, password } = body;
    const passwordIsValid = password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&*()_+{}\[\]:;<>,.?~\\-])[0-9a-zA-Z@#$%^&*()_+{}\[\]:;<>,.?~\\-]{8,}$/gm);

    if (!passwordIsValid) {
      throw new ResponseError(ExceptionsConstants.INVALID_PASSWORD_PATTERN, HttpStatus.BAD_REQUEST);
    }

    const user = await this.userRepository.findUserByPasswordToken(token);

    if (!user) {
      throw new ResponseError(ExceptionsConstants.INVALID_TOKEN, HttpStatus.UNAUTHORIZED);
    }

    const hashPassword = hashSync(password);

    await this.verifyJWTToken(token);

    await this.userRepository.update(
      { id: user._id },
      { passwordToken: null, password: hashPassword },
    );
  }

  async verifyJWTToken(jwtToken: string): Promise<void> {
    return new Promise((resolve, reject) => {
      jwt.verify(
        jwtToken,
        process.env.SECRET_TOKEN,
        async (
          err: JsonWebTokenError | NotBeforeError | TokenExpiredError,
          decodedCustomToken: DecodedAccessToken,
        ) => {
          if (err) {
            reject(new ResponseError(ExceptionsConstants.INVALID_TOKEN, HttpStatus.UNAUTHORIZED));
          }

          try {
            await this.validate(decodedCustomToken);
            resolve();
          } catch (error) {
            reject(error);
          }
        },
      );
    });
  }

  async validate(jwtPayload: DecodedAccessToken) {
    const { scope, exp } = jwtPayload;

    const dateFromUnixTimestamp = new Date(exp * 1000).getTime();
    const now = new Date().getTime();
    const isExpireToken = now >= dateFromUnixTimestamp;

    if (isExpireToken) {
      throw new ResponseError(ExceptionsConstants.EXPIRED_TOKEN, HttpStatus.UNAUTHORIZED);
    }

    if (!scope?.includes(ScopeEnum.USER_DEFINE_PASSWORD)) {
      throw new ResponseError(ExceptionsConstants.INVALID_TOKEN, HttpStatus.UNAUTHORIZED);
    }
  }
}
