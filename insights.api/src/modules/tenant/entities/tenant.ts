export interface Tenant {
  _id?: string;
  name: string;
  realmId: string;
  phone?: string;
  industry?: string;
  urlSlug: string;
  document: string;
  externalWorkspaceId: string;
  isActive: boolean;
}
