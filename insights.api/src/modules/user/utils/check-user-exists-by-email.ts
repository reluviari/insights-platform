import { HttpStatus } from "@foundation/lib";
import { ExceptionsConstants } from "@/commons/consts/exceptions";
import { ResponseError } from "@foundation/lib";
import { IUserRepository } from "../interfaces";

export const checkUserExistsByEmail = async (
  userRepository: IUserRepository,
  email: string,
  userId?: string,
) => {
  const userEmailExists = await userRepository.findUserByEmail(email);

  if (userEmailExists) {
    if (userId !== userEmailExists?._id) {
      throw new ResponseError(ExceptionsConstants.EMAIL_ALREADY_EXIST, HttpStatus.FOUND);
    }
  }
};
