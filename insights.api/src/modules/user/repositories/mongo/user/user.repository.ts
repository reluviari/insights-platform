import { MongooseUserRepository } from "@/modules/user/repositories/mongo/user/mongoose-user.repository";

export const userRepository = new MongooseUserRepository();
