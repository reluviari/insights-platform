import { ScopeEnum } from "@/modules/auth/enums";
import * as jwt from "jsonwebtoken";

export const generatePasswordToken = (id?: string, email?: string) => {
  return jwt.sign(
    {
      id,
      email,
      scope: [ScopeEnum.USER_DEFINE_PASSWORD],
    },
    String(process.env.SECRET_TOKEN),
    {
      expiresIn: String(process.env.SECRET_TOKEN_EXPIRE),
    },
  );
};
