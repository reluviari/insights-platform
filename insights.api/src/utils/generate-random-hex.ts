import { ExceptionsConstants } from "@/commons/consts/exceptions";
import { HttpStatus, ResponseError } from "@foundation/lib";
import crypto from "crypto";

export async function generateRandomHex() {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(8, (err, buf) => {
      if (err) {
        reject(
          new ResponseError(
            ExceptionsConstants.INTERNAL_SERVER_ERROR,
            HttpStatus.INTERNAL_SERVER_ERROR,
          ),
        );
      }

      resolve(buf.toString("hex"));
    });
  });
}
