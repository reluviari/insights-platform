import { HttpStatus } from "@foundation/lib";
import { ExceptionsConstants } from "@/commons/consts/exceptions";
import { ResponseError } from "@foundation/lib";
import { Types } from "mongoose";

export const validateObjectId = (objectId: string) => {
  const isObjectIdValid = Types.ObjectId.isValid(objectId);

  if (!isObjectIdValid) {
    throw new ResponseError(ExceptionsConstants.INVALID_OBJECT_ID, HttpStatus.BAD_REQUEST);
  }
};
