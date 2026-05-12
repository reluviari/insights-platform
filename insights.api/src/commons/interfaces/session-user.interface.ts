export interface SessionUser {
  id: string;
  email: string;
  urlSlug: string;
  tenantId: string;
  roles?: string[];
}
