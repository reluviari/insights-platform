import { User } from "../entities";
import { IUserRepository } from "@/modules/user/interfaces";

export class FindByEmailUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(email: string): Promise<User | null> {
    const user = await this.userRepository.findUserByEmail(email);

    if (!user) {
      return null;
    }

    return user;
  }
}
