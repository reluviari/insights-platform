import { UpdateResult } from "@/types";
import { PopulateOptions } from "@/commons/interfaces";
import { User } from "../entities";
import { WhereUser } from "./where-user.interface";
import { UpdateUser } from "./update-user.interface";

export interface IUserRepository {
  create(data: User): Promise<User>;
  updateMany(data: User[]): Promise<UpdateResult | null>;
  findUserByEmail(
    email: string,
    populates?: PopulateOptions[],
    /** Quando true, inclui o hash armazenado em `password` (schema usa `select: false`). */
    includePasswordHash?: boolean,
  ): Promise<User | null>;
  findUserByPasswordToken(
    passwordToken: string,
    populates?: PopulateOptions[],
  ): Promise<User | null>;
  findUserById(id: string, populates?: PopulateOptions[]): Promise<User | null>;
  findUserByIdAndTenantId(
    id: string,
    tenantId: string,
    populates?: PopulateOptions[],
  ): Promise<User | null>;
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
