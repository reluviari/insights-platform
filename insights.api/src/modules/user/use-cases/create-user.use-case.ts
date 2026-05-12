import { checkDepartmentsExist, checkUserExistsByEmail } from "./../utils";
import { IUserRepository } from "../interfaces";
import { IDepartmentRepository } from "@/modules/department/interfaces";
import { ICustomerRepository } from "@/modules/customer/interfaces";
import { CreateUserDto } from "../dtos";
import { User } from "../entities";
import { HttpStatus, ResponseError } from "@foundation/lib";
import { ExceptionsConstants } from "@/commons/consts/exceptions";
//import { uploadImageToS3 } from "@/utils/s3-upload-image";

export class CreateUserUseCase {
  constructor(
    private userRepository: IUserRepository,
    private departmentRepository: IDepartmentRepository,
    private customerRepository: ICustomerRepository,
  ) {}

  async execute(tenantId: string, customerId: string, data: CreateUserDto): Promise<User> {
    await this.validateInput(tenantId, customerId, data);

    // let newAvatar: string;
    // if (data.avatar) {
    //   newAvatar = await uploadImageToS3(data.avatar);
    // }

    return this.userRepository.create({
      ...data,
      //avatar: newAvatar,
      customer: customerId,
      tenants: [tenantId],
      departments: data.departmentIds,
    });
  }

  private async validateInput(tenantId: string, customerId: string, data: CreateUserDto) {
    const customer = await this.customerRepository.findByIdAndTenantId(customerId, tenantId);

    if (!customer) {
      throw new ResponseError(ExceptionsConstants.CUSTOMER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    await Promise.all([
      checkUserExistsByEmail(this.userRepository, data.email),
      checkDepartmentsExist(this.departmentRepository, data.departmentIds),
      this.checkDepartmentsBelongToCustomer(customerId, data.departmentIds),
    ]);
  }

  private async checkDepartmentsBelongToCustomer(customerId: string, departmentIds?: string[]) {
    if (!departmentIds?.length) {
      return;
    }

    const departments = await Promise.all(
      departmentIds.map(departmentId =>
        this.departmentRepository.findByIdAndCustomerId(departmentId, customerId),
      ),
    );

    if (departments.some(department => !department)) {
      throw new ResponseError(ExceptionsConstants.DEPARTMENT_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
  }
}
