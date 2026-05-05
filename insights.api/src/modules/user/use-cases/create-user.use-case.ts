import { checkCustomerExist, checkDepartmentsExist, checkUserExistsByEmail } from "./../utils";
import { IUserRepository } from "../interfaces";
import { IDepartmentRepository } from "@/modules/department/interfaces";
import { ICustomerRepository } from "@/modules/customer/interfaces";
import { CreateUserDto } from "../dtos";
import { User } from "../entities";
//import { uploadImageToS3 } from "@/utils/s3-upload-image";

export class CreateUserUseCase {
  constructor(
    private userRepository: IUserRepository,
    private departmentRepository: IDepartmentRepository,
    private customerRepository: ICustomerRepository,
  ) { }

  async execute(customerId: string, data: CreateUserDto): Promise<User> {
    await this.validateInput(customerId, data);

    // let newAvatar: string;
    // if (data.avatar) {
    //   newAvatar = await uploadImageToS3(data.avatar);
    // }

    const tenant = (await this.customerRepository.findById(customerId)).tenant;

    return this.userRepository.create({
      ...data,
      //avatar: newAvatar,
      customer: customerId,
      tenants: [tenant.toString()],
      departments: data.departmentIds,
    });
  }

  private async validateInput(customerId: string, data: CreateUserDto) {
    await Promise.all([
      checkCustomerExist(this.customerRepository, customerId),
      checkUserExistsByEmail(this.userRepository, data.email),
      checkDepartmentsExist(this.departmentRepository, data.departmentIds),
    ]);
  }
}
