import { ScopeEnum } from "../enums";

export interface DecodedAccessToken {
  id: string;
  name: string;
  email: string;
  urlSlug: string;
  tenantId: string;
  roles: string[];
  scope: ScopeEnum[];
  iat: number;
  exp: number;
}
