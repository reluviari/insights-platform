import { IDepartmentRepository } from "../interfaces";
import { HttpStatus, ResponseError } from "@foundation/lib";
import { ExceptionsConstants } from "@/commons/consts/exceptions";
import { CreateDepartmentType } from "../types/create-department.type";
import { ICustomerRepository } from "@/modules/customer/interfaces";
import { Department } from "../entities";

export class CreateDepartmentUseCase {
  constructor(
    private departmentRepository: IDepartmentRepository,
    private customerRepository: ICustomerRepository,
  ) {}

  async execute(customerId: string, data: CreateDepartmentType): Promise<Department> {
    const department = await this.departmentRepository.findByTitle(data?.title, customerId);

    if (department) {
      throw new ResponseError(ExceptionsConstants.DEPARTMENT_ALREADY_EXIST, HttpStatus.BAD_REQUEST);
    }

    const customer = await this.customerRepository.findById(customerId);

    if (!customer) {
      throw new ResponseError(ExceptionsConstants.CUSTOMER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    return this.departmentRepository.create({ ...data, customer: customerId });
  }
}
