import { checkDepartmentsExist, checkUserExistsByEmail, checkUserExistsById } from "./../utils";
import { IUserRepository } from "../interfaces";
import { IDepartmentRepository } from "@/modules/department/interfaces";
import { hashSync } from "@/utils/hash-sync";
import { UpdateUserDto } from "../dtos";
import { User } from "../entities";

export class UpdateUserUseCase {
  constructor(
    private userRepository: IUserRepository,
    private departmentRepository: IDepartmentRepository,
  ) {}

  async update(id: string, data: UpdateUserDto): Promise<User> {
    await this.validateInput(id, data);

    const newData = { ...data };

    if (newData.password) {
      newData.password = hashSync(newData.password);
    }

    const convertData = {
      ...newData,
      departments: newData.departmentIds,
    };

    delete convertData.departmentIds;

    return this.userRepository.update({ id }, convertData);
  }

  private async validateInput(id: string, data: UpdateUserDto) {
    const validations = [checkUserExistsById(this.userRepository, id)];
    if (data.email) {
      validations.push(checkUserExistsByEmail(this.userRepository, data.email, id));
    }
    if (data.departmentIds) {
      validations.push(checkDepartmentsExist(this.departmentRepository, data.departmentIds));
    }
    await Promise.all(validations);
  }
}
