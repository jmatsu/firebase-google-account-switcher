import { ProjectId } from "../domain/valueobject";
import AccountRepository from "../repository/account_repository";
import { Account } from "../domain/account";

export class DeleteProjectAssociationsByProjectIdUsecase {
  constructor(
    private accountRepository: AccountRepository = new AccountRepository()
  ) {}

  async apply(args: DeleteProjectAssociationsByProjectIdUsecaseArgs) {
    const accounts = await this.accountRepository.findAllByProjectId(
      args.projectId
    );

    if (accounts.length === 0) {
      return;
    }

    const newAccounts = accounts.map(account => {
      return <Account>{
        ...account,
        associatedProjectIds: account.associatedProjectIds.filter(
          id => id !== args.projectId
        )
      };
    });

    await this.accountRepository.updateAll(...newAccounts);
  }
}

export interface DeleteProjectAssociationsByProjectIdUsecaseArgs {
  projectId: ProjectId;
}
