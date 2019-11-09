import { CreateAccountUsecase } from "../create_account_usecase";
import AccountRepository from "../../repository/account_repository";
import { Account } from "../../domain/account";

test("a usecase should return an account with default values", async () => {
  const repository = new AccountRepository();
  spyOn(repository, "save").and.returnValue(Promise.resolve());

  const usecase = new CreateAccountUsecase(repository);
  const account = await usecase.apply({
    email: "sample@example.com"
  });

  expect(account).toEqual({
    id: "sample@example.com",
    email: "sample@example.com",
    associatedProjectIds: []
  });

  expect(repository.save).toHaveBeenCalledWith<Account[]>(account);
});
