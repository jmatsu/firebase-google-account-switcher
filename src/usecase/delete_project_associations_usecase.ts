import AccountRepository from "../repository/account_repository";
import { Account } from "../domain/account";

export class DeleteProjectAssociationsUsecase {
  constructor(
    private accountRepository: AccountRepository = new AccountRepository()
  ) {}

  async apply(_args: DeleteProjectAssociationsUsecaseArgs) {
    const accounts = await this.accountRepository.findAll();

    if (accounts.length === 0) {
      return;
    }

    const newAccounts = accounts.map(account => {
      return <Account>{
        ...account,
        associatedProjectIds: []
      };
    });

    await this.accountRepository.updateAll(...newAccounts);
  }
}

export interface DeleteProjectAssociationsUsecaseArgs {}
