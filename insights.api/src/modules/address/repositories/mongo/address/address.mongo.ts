import { Document } from "mongoose";
import { Address } from "@/modules/address/entities";

export interface AddressDocument extends Omit<Address, "_id">, Document {}
