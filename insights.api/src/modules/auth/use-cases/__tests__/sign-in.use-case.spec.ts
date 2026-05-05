import bcrypt from "bcryptjs";
import { SignInDto } from "../../dtos/sign-in.dto";
import { SignInUseCase } from "@/modules/auth/use-cases/sign-in";
import { HttpStatus } from "@foundation/lib";
import { ExceptionsConstants } from "@/commons/consts/exceptions";
import type { IUserRepository } from "@/modules/user/interfaces";

describe("SignInUseCase", () => {
  const passwordPlain = "DevPass123!";
  let passwordHash: string;

  let repo: jest.Mocked<
    Pick<IUserRepository, "findUserByEmail" | "update">
  >;

  let useCase: SignInUseCase;

  beforeAll(() => {
    passwordHash = bcrypt.hashSync(passwordPlain, 8);
  });

  beforeEach(() => {
    process.env.SECRET_TOKEN = "unit-test-secret";
    process.env.SECRET_TOKEN_EXPIRE = "1h";

    repo = {
      findUserByEmail: jest.fn(),
      update: jest.fn().mockResolvedValue({}),
    };

    useCase = new SignInUseCase(repo as unknown as IUserRepository);
  });

  it("devolve accessToken quando credenciais e slug são válidos", async () => {
    repo.findUserByEmail.mockResolvedValue({
      _id: "507f191e810c19729de860e3",
      name: "Dev",
      email: "dev@example.com",
      roles: ["USER"],
      isActive: true,
      password: passwordHash,
      status: true,
      phone: "",
    });

    const result = await useCase.execute({
      email: "dev@example.com",
      password: passwordPlain,
      urlSlug: "http://localhost:3000",
    } as SignInDto);

    expect(result.accessToken).toBeDefined();
    expect(typeof result.accessToken).toBe("string");
    expect(repo.findUserByEmail).toHaveBeenCalledWith("dev@example.com", undefined, true);
    expect(repo.update).toHaveBeenCalled();
  });

  it("401 quando utilizador não existe", async () => {
    repo.findUserByEmail.mockResolvedValue(null);

    await expect(
      useCase.execute({
        email: "none@example.com",
        password: passwordPlain,
        urlSlug: "http://localhost:3000",
      } as SignInDto),
    ).rejects.toMatchObject({
      statusCode: HttpStatus.UNAUTHORIZED,
      message: ExceptionsConstants.UNAUTHORIZED,
    });
  });

  it("401 quando senha está incorreta", async () => {
    repo.findUserByEmail.mockResolvedValue({
      _id: "507f191e810c19729de860e3",
      name: "Dev",
      email: "dev@example.com",
      roles: ["USER"],
      isActive: true,
      password: passwordHash,
      status: true,
      phone: "",
    });

    await expect(
      useCase.execute({
        email: "dev@example.com",
        password: "wrong-password",
        urlSlug: "http://localhost:3000",
      } as SignInDto),
    ).rejects.toMatchObject({
      statusCode: HttpStatus.UNAUTHORIZED,
    });
  });

  it("400 quando Origin/urlSlug inválido", async () => {
    await expect(
      useCase.execute({
        email: "dev@example.com",
        password: passwordPlain,
        urlSlug: "not-a-valid-url",
      } as SignInDto),
    ).rejects.toMatchObject({
      statusCode: HttpStatus.BAD_REQUEST,
      message: ExceptionsConstants.INVALID_URL_SLUG,
    });
  });

  it("400 quando utilizador inativo", async () => {
    repo.findUserByEmail.mockResolvedValue({
      _id: "507f191e810c19729de860e3",
      name: "Dev",
      email: "dev@example.com",
      roles: ["USER"],
      isActive: false,
      password: passwordHash,
      status: true,
      phone: "",
    });

    await expect(
      useCase.execute({
        email: "dev@example.com",
        password: passwordPlain,
        urlSlug: "http://localhost:3000",
      } as SignInDto),
    ).rejects.toMatchObject({
      statusCode: HttpStatus.BAD_REQUEST,
      message: ExceptionsConstants.INACTIVE_USER,
    });
  });

  it("401 quando email ou senha em falta", async () => {
    await expect(
      useCase.execute({
        email: "",
        password: passwordPlain,
        urlSlug: "http://localhost:3000",
      } as SignInDto),
    ).rejects.toMatchObject({ statusCode: HttpStatus.UNAUTHORIZED });

    await expect(
      useCase.execute({
        email: "dev@example.com",
        password: "",
        urlSlug: "http://localhost:3000",
      } as SignInDto),
    ).rejects.toMatchObject({ statusCode: HttpStatus.UNAUTHORIZED });
  });

  it("devolve accessToken quando administrador (ADMIN) faz login", async () => {
    repo.findUserByEmail.mockResolvedValue({
      _id: "507f191e810c19729de860e4",
      name: "Administrador da plataforma (seed)",
      email: "admin@example.com",
      roles: ["ADMIN"],
      isActive: true,
      password: passwordHash,
      status: true,
      phone: "",
    });

    const result = await useCase.execute({
      email: "admin@example.com",
      password: passwordPlain,
      urlSlug: "http://localhost:3000",
    } as SignInDto);

    expect(result.accessToken).toBeDefined();
    expect(repo.findUserByEmail).toHaveBeenCalledWith("admin@example.com", undefined, true);
  });
});
