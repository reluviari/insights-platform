import { DefaultUser as IUser, DefaultSession as ISession } from "next-auth";

declare module "next-auth" {
  interface DefaultUser extends IUser {
    accessToken: string;
  }

  interface Session extends ISession {
    user?: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
    error?: string;
    accessToken?: string;
  }
}
