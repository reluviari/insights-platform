import { ICustomerRepository } from "@/modules/customer/interfaces";
import { IDepartmentRepository } from "../interfaces";
import { HttpStatus, ResponseError } from "@foundation/lib";
import { ExceptionsConstants } from "@/commons/consts/exceptions";

export class DeleteDepartmentUseCase {
  constructor(
    private departmentRepository: IDepartmentRepository,
    private customerRepository: ICustomerRepository,
  ) {}

  async execute(tenantId: string, customerId: string, departmentId: string): Promise<void> {
    const [customer, departmentExists] = await Promise.all([
      this.customerRepository.findByIdAndTenantId(customerId, tenantId),
      this.departmentRepository.findByIdAndCustomerId(departmentId, customerId),
    ]);

    if (!customer) {
      throw new ResponseError(ExceptionsConstants.CUSTOMER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    if (!departmentExists) {
      throw new ResponseError(ExceptionsConstants.DEPARTMENT_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    await this.departmentRepository.deleteByIdAndCustomerId(departmentId, customerId);
  }
}
