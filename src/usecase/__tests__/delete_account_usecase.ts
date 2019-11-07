import { DeleteAccountUsecase } from "../delete_account_usecase";
import AccountRepository from "../../repository/account_repository";
import { AccountId } from "../../domain/account";

test("a usecase should delete an account through repository", async () => {
  const repository = new AccountRepository();
  spyOn(repository, "delete").and.returnValue(Promise.resolve());

  const usecase = new DeleteAccountUsecase(repository);
  await usecase.apply({ id: "id" });

  expect(repository.delete).toHaveBeenCalledWith<AccountId[]>("id");
});
