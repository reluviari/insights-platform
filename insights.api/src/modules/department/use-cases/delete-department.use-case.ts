import { IDepartmentRepository } from "../interfaces";
import { HttpStatus, ResponseError } from "@foundation/lib";
import { ExceptionsConstants } from "@/commons/consts/exceptions";

export class DeleteDepartmentUseCase {
  constructor(private departmentRepository: IDepartmentRepository) {}

  async execute(departmentId: string): Promise<void> {
    const departmentExists = await this.departmentRepository.findById(departmentId);

    if (!departmentExists) {
      throw new ResponseError(ExceptionsConstants.DEPARTMENT_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    await this.departmentRepository.delete(departmentId);
  }
}
