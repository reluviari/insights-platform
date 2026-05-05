import mongoose from "mongoose";
import { HttpResponse, ResponseError } from "./httpResponse";
import { HttpStatus } from "./httpStatus";
import { ExceptionsConstants } from "@/commons/consts/exceptions";

export function ConnectMongoDB() {
  return function (
    _target: any,
    _propertyKey: string,
    descriptor: PropertyDescriptor,
  ): PropertyDescriptor {
    const originalMethod = descriptor.value;



    descriptor.value = async function (...args: any[]): Promise<unknown> {
      try {
        const mongoURI = String(process.env.MONGODB_URI);

        await mongoose.connect(mongoURI, {
          serverSelectionTimeoutMS: 5000,
        });

        console.info("Connect database with status: " + mongoose.connection.readyState);
        const result = await originalMethod.apply(this, args);
        await mongoose.connection.close();
        return result;
      } catch (error) {
        const hash = new Date().getTime().toString();
        console.error("[Lib] Connection MongoDB Error: ", error);
        console.error("[Lib] MongoDB Hash: ", hash);

        return HttpResponse.error(
          new ResponseError(
            ExceptionsConstants.INTERNAL_SERVER_ERROR,
            HttpStatus.INTERNAL_SERVER_ERROR,
          ),
          "Error connecting to MongoDB",
        );
      }
    };

    return descriptor;
  };
}
