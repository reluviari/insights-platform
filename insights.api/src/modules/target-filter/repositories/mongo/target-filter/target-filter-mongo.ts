import { Document } from "mongoose";
import { TargetFilter } from "@/modules/target-filter/entities";

export interface TargetFilterDocument extends Omit<TargetFilter, "_id">, Document {}
