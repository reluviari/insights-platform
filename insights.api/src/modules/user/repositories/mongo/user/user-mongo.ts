import { Document } from "mongoose";
import { User } from "@/modules/user/entities";

export interface UserDocument extends Omit<User, "_id">, Document {}
