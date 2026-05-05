import { Schema, Types, model } from "mongoose";
import { CUSTOMER_SCHEMA } from "@/modules/customer/repositories/mongo/customer/customer.schema";

export const ADDRESS_SCHEMA = "address";

const AddressSchema = new Schema(
  {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
    customer: { type: Types.ObjectId, ref: CUSTOMER_SCHEMA, required: true },
  },
  { timestamps: true },
);

export const AddressModel = model(ADDRESS_SCHEMA, AddressSchema);
