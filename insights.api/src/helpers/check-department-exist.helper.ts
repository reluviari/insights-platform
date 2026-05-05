import { ResponseError } from "@foundation/lib";
import { ExceptionsConstants } from "@/commons/consts/exceptions";
import { HttpStatus } from "@foundation/lib";
import { IDepartmentRepository } from "@/modules/department/interfaces";

export async function checkDepartmentExist(
  departmentId: string,
  departmentRepository: IDepartmentRepository,
) {
  const department = await departmentRepository.findById(departmentId);

  if (!department) {
    throw new ResponseError(ExceptionsConstants.DEPARTMENT_NOT_FOUND, HttpStatus.NOT_FOUND);
  }
  return department;
}
