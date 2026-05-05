import { UpdateResult } from "@/types";
import { PopulateOptions } from "@/commons/interfaces";
import { User } from "../entities";
import { WhereUser } from "./where-user.interface";
import { UpdateUser } from "./update-user.interface";

/** Snapshot mínimo para login clássico (lean, sem populate / toUser). */
export type AuthCredentialsUser = {
  _id: string;
  email: string;
  name: string;
  roles: string[];
  isActive: boolean;
  password?: string;
};

export interface IUserRepository {
  create(data: User): Promise<User>;
  updateMany(data: User[]): Promise<UpdateResult | null>;
  findUserByEmail(email: string, populates?: PopulateOptions[]): Promise<User | null>;
  /** Login e-mail+senha: leitura direta no Mongo (lean), inclui password e ignora maiúsculas no e-mail. */
  findAuthCredentialsByEmail(email: string): Promise<AuthCredentialsUser | null>;
  findUserByPasswordToken(
    passwordToken: string,
    populates?: PopulateOptions[],
  ): Promise<User | null>;
  findUserById(id: string, populates?: PopulateOptions[]): Promise<User | null>;
  update(filter: { id: string }, data: UpdateUser): Promise<User>;
  listUserByTenantId(
    where?: WhereUser,
    page?: number,
    limit?: number,
    populates?: PopulateOptions[],
  ): Promise<User[]>;
  countUserByTenantId(where?: WhereUser): Promise<number>;
  listUserByCustomerId(customerId: string, page?: number, limit?: number): Promise<User[]>;
  listUserByDepartmentId(departmentId: string): Promise<User[]>;
  updateUsersReportFilters(reportFilterId: string): Promise<void>;
  updateUsersDepartments(departmentId: string): Promise<void>;
  countUserByCustomerId(customerId: string): Promise<number>;
}
