import { HttpStatus } from "@foundation/lib";
import { ExceptionsConstants } from "@/commons/consts/exceptions";
import { ResponseError } from "@foundation/lib";
import { IDepartmentRepository } from "@/modules/department/interfaces";

export const checkDepartmentsExist = async (
  departmentRepository: IDepartmentRepository,
  departmentIds: string[],
) => {
  if (Array.isArray(departmentIds) && departmentIds.length) {
    const validDepartments = await Promise.all(
      departmentIds.map(departmentId => departmentRepository.findById(departmentId)),
    );

    if (validDepartments.filter(Boolean).length !== departmentIds.length) {
      throw new ResponseError(ExceptionsConstants.DEPARTMENT_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
  }
};
