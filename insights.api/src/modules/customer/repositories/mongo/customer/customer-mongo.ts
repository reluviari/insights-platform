import { Document } from "mongoose";
import { Customer } from "@/modules/customer/entities";

export interface CustomerDocument extends Omit<Customer, "_id">, Document {}
