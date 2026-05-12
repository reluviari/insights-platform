import { checkDepartmentsExist, checkUserExistsByEmail } from "./../utils";
import { IUserRepository } from "../interfaces";
import { IDepartmentRepository } from "@/modules/department/interfaces";
import { hashSync } from "@/utils/hash-sync";
import { UpdateUserDto } from "../dtos";
import { User } from "../entities";
import { HttpStatus, ResponseError } from "@foundation/lib";
import { ExceptionsConstants } from "@/commons/consts/exceptions";

export class UpdateUserUseCase {
  constructor(
    private userRepository: IUserRepository,
    private departmentRepository: IDepartmentRepository,
  ) {}

  async update(tenantId: string, id: string, data: UpdateUserDto): Promise<User> {
    const user = await this.validateInput(tenantId, id, data);

    const newData = { ...data };

    if (newData.password) {
      newData.password = hashSync(newData.password);
    }

    const convertData = {
      ...newData,
      departments: newData.departmentIds,
    };

    delete convertData.departmentIds;

    return this.userRepository.update({ id: user._id }, convertData);
  }

  private async validateInput(tenantId: string, id: string, data: UpdateUserDto) {
    const user = await this.userRepository.findUserByIdAndTenantId(id, tenantId);

    if (!user) {
      throw new ResponseError(ExceptionsConstants.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    const validations = [];
    if (data.email) {
      validations.push(checkUserExistsByEmail(this.userRepository, data.email, id));
    }
    if (data.departmentIds) {
      validations.push(checkDepartmentsExist(this.departmentRepository, data.departmentIds));
      validations.push(
        this.checkDepartmentsBelongToCustomer(user.customer as string, data.departmentIds),
      );
    }
    await Promise.all(validations);

    return user;
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
