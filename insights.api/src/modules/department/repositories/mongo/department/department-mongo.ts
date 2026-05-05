import { Document } from "mongoose";
import { Department } from "@/modules/department/entities";

export interface DepartmentDocument extends Omit<Department, "_id">, Document {}
