import { ScopeEnum } from "@/modules/auth/enums";
import * as jwt from "jsonwebtoken";
import { SignOptions } from "jsonwebtoken";

export const generatePasswordToken = (id?: string, email?: string) => {
  const signOptions: SignOptions = {
    expiresIn: process.env.SECRET_TOKEN_EXPIRE as SignOptions["expiresIn"],
  };

  return jwt.sign(
    {
      id,
      email,
      scope: [ScopeEnum.USER_DEFINE_PASSWORD],
    },
    String(process.env.SECRET_TOKEN),
    signOptions,
  );
};
