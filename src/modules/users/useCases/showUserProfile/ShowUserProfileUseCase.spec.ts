import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";


let showUserProfileUseCase: ShowUserProfileUseCase
let usersRepositoryInMemory: InMemoryUsersRepository
let createUserUseCase: CreateUserUseCase

describe("Show user profile", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(usersRepositoryInMemory);
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  })

  it("should be able to show a user profile", async () => {
    const user: ICreateUserDTO = {
      name: "UserAuthenticatePassword",
      email: "userauthenticate@password.com.br",
      password : "12345"
    };

    const userCreated = await createUserUseCase.execute({
      name: user.name,
      email: user.email,
      password: user.password,
    });

    if(userCreated.id){
      const userId = await showUserProfileUseCase.execute(userCreated.id);

      expect(userId).toHaveProperty("id");
    }
  })

})
