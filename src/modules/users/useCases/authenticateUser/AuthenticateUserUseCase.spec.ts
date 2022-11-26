import auth from "../../../../config/auth";
import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";

let authenticateUserUseCase: AuthenticateUserUseCase
let usersRepositoryInMemory: InMemoryUsersRepository
let createUserUseCase: CreateUserUseCase

describe("Authenticate User", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    authenticateUserUseCase = new AuthenticateUserUseCase(usersRepositoryInMemory);
  })

  it("should be able to authenticate an user", async () => {
    const user: ICreateUserDTO = {
      name: "User Authenticate",
      email: "userauthenticate@test.com.br",
      password : "test12345"
    };

    await createUserUseCase.execute({
      name: user.name,
      email: user.email,
      password: user.password
    });

    auth.jwt.secret = user.password;

    const Authentication = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password,
    });

    expect(Authentication).toHaveProperty("token");

  });

  it("should not be able to authenticate with incorrect password", () => {
    expect(async () => {
      await authenticateUserUseCase.execute({
        email: "user@false.com.br",
        password: "12345",
      });
    }).rejects.toBeInstanceOf(AppError);
  })

  it("should not be able to authenticate with incorrect password", () => {
    expect(async () =>{
      const user: ICreateUserDTO = {
        name: "UserAuthenticatePassword",
        email: "userauthenticate@password.com.br",
        password : "12345"
      };

      await createUserUseCase.execute({
        name: user.name,
        email: user.email,
        password: user.password,
      });

      await authenticateUserUseCase.execute({
        email: user.email,
        password: "incorrectPasswordTest",
      });
    }).rejects.toBeInstanceOf(AppError);

  })

})
