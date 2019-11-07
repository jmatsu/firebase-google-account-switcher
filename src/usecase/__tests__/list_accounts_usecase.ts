import {
  ListAccountsUsecase,
  ListAccountsUsecaseArgs
} from "../list_accounts_usecase";
import AccountRepository from "../../repository/account_repository";
import { Account } from "../../domain/account";

test("a usecase should delete a project id", async () => {
  const account: Account = {
    id: "id",
    email: "sample@example.com",
    associatedProjectIds: ["project_id"]
  };
  const dittoAccount: Account = {
    id: "id2",
    email: "sample2@example.com",
    associatedProjectIds: ["project_id2"]
  };

  const repository = new AccountRepository();
  spyOn(repository, "findAll").and.returnValue(
    Promise.resolve([account, dittoAccount])
  );

  const usecase = new ListAccountsUsecase(repository);
  const args: ListAccountsUsecaseArgs = {};
  const accounts = await usecase.apply(args);

  expect(accounts).toEqual([account, dittoAccount]);
  expect(repository.findAll).toHaveBeenCalled();
});
