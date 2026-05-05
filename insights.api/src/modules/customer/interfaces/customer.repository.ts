import { PopulateOptions } from "@/commons/interfaces";
import { UpdateCustomerDto } from "../dtos/update-customer.dto";
import { Customer } from "../entities";
import { WhereCustomer } from "./where-customer.interface";
export interface ICustomerRepository {
  findById(customerId: string, populates?: PopulateOptions[]): Promise<Customer>;
  listAll(
    where?: WhereCustomer,
    page?: number,
    limit?: number,
    populates?: PopulateOptions[],
  ): Promise<Customer[]>;
  count(where?: WhereCustomer): Promise<number>;
  create(data: Customer): Promise<Customer>;
  update(customerId: string, data: UpdateCustomerDto): Promise<Customer>;
  findByDocument(document: string): Promise<Customer>;
}
