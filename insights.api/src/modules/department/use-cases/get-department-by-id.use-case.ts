import { IDepartmentRepository } from "@/modules/department/interfaces";
import { ICustomerRepository } from "@/modules/customer/interfaces";
import { HttpStatus, ResponseError } from "@foundation/lib";
import { ExceptionsConstants } from "@/commons/consts/exceptions";
import { Department } from "../entities";

export class GetDepartmentByIdUseCase {
  private readonly populateDepartment = [{ path: "reportFilters", populate: { path: "target" } }];

  constructor(
    private departmentRepository: IDepartmentRepository,
    private customerRepository: ICustomerRepository,
  ) {}

  async execute(tenantId: string, customerId: string, departmentId: string): Promise<Department> {
    const [customer, department] = await Promise.all([
      this.customerRepository.findByIdAndTenantId(customerId, tenantId),
      this.departmentRepository.findByIdAndCustomerId(
        departmentId,
        customerId,
        this.populateDepartment,
      ),
    ]);

    if (!customer) {
      throw new ResponseError(ExceptionsConstants.CUSTOMER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    if (!department) {
      throw new ResponseError(ExceptionsConstants.DEPARTMENT_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    return department;
  }
}
