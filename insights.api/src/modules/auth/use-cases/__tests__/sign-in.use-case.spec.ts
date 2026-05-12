import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { SignInDto } from "../../dtos/sign-in.dto";
import { SignInUseCase } from "@/modules/auth/use-cases/sign-in";
import { HttpStatus } from "@foundation/lib";
import { ExceptionsConstants } from "@/commons/consts/exceptions";
import { IUserRepository } from "@/modules/user/interfaces";
import { ITenantRepository } from "@/modules/tenant/interfaces/tenant.repository.interface";

describe("SignInUseCase", () => {
  const passwordPlain = "DevPass123!";
  const tenantId = "507f191e810c19729de860f1";
  let passwordHash: string;

  let repo: jest.Mocked<Pick<IUserRepository, "findUserByEmail" | "update">>;
  let tenantRepository: jest.Mocked<Pick<ITenantRepository, "findBySlug">>;

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
    tenantRepository = {
      findBySlug: jest.fn().mockResolvedValue({
        _id: tenantId,
        name: "Dev Tenant",
        realmId: "dev",
        urlSlug: "http://localhost:3000",
        document: "123",
        externalWorkspaceId: "workspace-id",
        isActive: true,
      }),
    };

    useCase = new SignInUseCase(
      repo as unknown as IUserRepository,
      tenantRepository as unknown as ITenantRepository,
    );
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
      tenants: [tenantId],
    });

    const result = await useCase.execute({
      email: "dev@example.com",
      password: passwordPlain,
      urlSlug: "http://localhost:3000",
    } as SignInDto);

    const decoded = jwt.decode(result.accessToken) as { tenantId: string; urlSlug: string };

    expect(result.accessToken).toBeDefined();
    expect(typeof result.accessToken).toBe("string");
    expect(decoded.tenantId).toBe(tenantId);
    expect(decoded.urlSlug).toBe("http://localhost:3000");
    expect(tenantRepository.findBySlug).toHaveBeenCalledWith("http://localhost:3000");
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
      tenants: [tenantId],
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

  it("400 quando Origin/urlSlug não resolve tenant", async () => {
    tenantRepository.findBySlug.mockResolvedValue(null);

    await expect(
      useCase.execute({
        email: "dev@example.com",
        password: passwordPlain,
        urlSlug: "http://localhost:3000",
      } as SignInDto),
    ).rejects.toMatchObject({
      statusCode: HttpStatus.BAD_REQUEST,
      message: ExceptionsConstants.TENANT_NOT_FOUND,
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
      tenants: [tenantId],
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

  it("401 quando usuário não pertence ao tenant do Origin", async () => {
    repo.findUserByEmail.mockResolvedValue({
      _id: "507f191e810c19729de860e3",
      name: "Dev",
      email: "dev@example.com",
      roles: ["USER"],
      isActive: true,
      password: passwordHash,
      status: true,
      phone: "",
      tenants: ["507f191e810c19729de860f2"],
    });

    await expect(
      useCase.execute({
        email: "dev@example.com",
        password: passwordPlain,
        urlSlug: "http://localhost:3000",
      } as SignInDto),
    ).rejects.toMatchObject({
      statusCode: HttpStatus.UNAUTHORIZED,
      message: ExceptionsConstants.UNAUTHORIZED,
    });
  });

  it("401 quando usuário não tem tenants nem customer compatível", async () => {
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
        password: passwordPlain,
        urlSlug: "http://localhost:3000",
      } as SignInDto),
    ).rejects.toMatchObject({ statusCode: HttpStatus.UNAUTHORIZED });
  });

  it("permite vínculo via customer.tenant quando tenants não está preenchido", async () => {
    repo.findUserByEmail.mockResolvedValue({
      _id: "507f191e810c19729de860e3",
      name: "Dev",
      email: "dev@example.com",
      roles: ["USER"],
      isActive: true,
      password: passwordHash,
      status: true,
      phone: "",
      customer: {
        _id: "507f191e810c19729de860c1",
        name: "Customer",
        document: "123",
        tenant: tenantId,
        reports: [],
      },
    });

    const result = await useCase.execute({
      email: "dev@example.com",
      password: passwordPlain,
      urlSlug: "http://localhost:3000",
    } as SignInDto);

    expect(result.accessToken).toBeDefined();
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
      tenants: [tenantId],
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
