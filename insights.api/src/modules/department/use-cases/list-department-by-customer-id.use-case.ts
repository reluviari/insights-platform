import { IDepartmentRepository, ListDepartment } from "@/modules/department/interfaces";
import { FilterDepartmentDto } from "../dtos";
import { ICustomerRepository } from "@/modules/customer/interfaces";
import { HttpStatus, ResponseError } from "@foundation/lib";
import { ExceptionsConstants } from "@/commons/consts/exceptions";
import { ITenantRepository } from "@/modules/tenant/interfaces/tenant.repository.interface";

export class ListDepartmentByCustomerIdUseCase {
  constructor(
    private departmentRepository: IDepartmentRepository,
    private customerRepository: ICustomerRepository,
    private tenantRepository: ITenantRepository,
  ) {}

  async execute(
    customerId: string,
    urlSlug: string,
    where: FilterDepartmentDto,
  ): Promise<ListDepartment> {
    const { page, pageSize, ...restWhere } = where;
    const [customer, departments, count] = await Promise.all([
      this.customerRepository.findById(customerId),
      this.departmentRepository.listAll({ customer: customerId, ...restWhere }, page, pageSize),
      this.departmentRepository.count({ customer: customerId, ...restWhere }),
    ]);

    if (!customer) {
      throw new ResponseError(ExceptionsConstants.CUSTOMER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    const tenant = await this.tenantRepository.findBySlug(urlSlug);

    if (customer.tenant !== tenant._id) {
      throw new ResponseError(ExceptionsConstants.UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
    }

    return { departments, count };
  }
}
