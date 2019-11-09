import {
  DeleteProjectAssociationsByProjectIdUsecase,
  DeleteProjectAssociationsByProjectIdUsecaseArgs
} from "../delete_project_associations_by_project_id_usecase";
import AccountRepository from "../../repository/account_repository";
import { Account } from "../../domain/account";
import { ProjectId } from "../../domain/valueobject";

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
  spyOn(repository, "findAllByProjectId").and.returnValue(
    Promise.resolve([account, dittoAccount])
  );

  const usecase = new DeleteProjectAssociationsByProjectIdUsecase(repository);
  const args: DeleteProjectAssociationsByProjectIdUsecaseArgs = {
    projectId: "project_id"
  };
  await usecase.apply(args);

  expect(repository.findAllByProjectId).toHaveBeenCalledWith<ProjectId[]>(
    args.projectId
  );

  expect(repository.updateAll).toHaveBeenCalledWith<Account[]>(
    {
      id: account.id,
      email: account.email,
      associatedProjectIds: []
    },
    dittoAccount
  );
});
