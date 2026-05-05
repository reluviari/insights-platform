import { HttpStatus } from "@foundation/lib";
import { ExceptionsConstants } from "@/commons/consts/exceptions";
import { ResponseError } from "@foundation/lib";
import { IUserRepository } from "../interfaces";

export const checkUserExistsById = async (userRepository: IUserRepository, id: string) => {
  const userExists = await userRepository.findUserById(id);
  if (!userExists) {
    throw new ResponseError(ExceptionsConstants.USER_NOT_FOUND, HttpStatus.BAD_REQUEST);
  }
};
