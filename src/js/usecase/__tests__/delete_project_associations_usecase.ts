import {
  DeleteProjectAssociationsUsecase,
  DeleteProjectAssociationsUsecaseArgs
} from "../delete_project_associations_usecase";
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
  spyOn(repository, "updateAll").and.returnValue(Promise.resolve());
  spyOn(repository, "findAll").and.returnValue(
    Promise.resolve([account, dittoAccount])
  );

  const usecase = new DeleteProjectAssociationsUsecase(repository);
  const args: DeleteProjectAssociationsUsecaseArgs = {};
  await usecase.apply(args);

  expect(repository.findAll).toHaveBeenCalled();

  expect(repository.updateAll).toHaveBeenCalledWith<Account[]>(
    {
      id: account.id,
      email: account.email,
      associatedProjectIds: []
    },
    {
      id: "id2",
      email: "sample2@example.com",
      associatedProjectIds: []
    }
  );
});
