import AccountRepository from "../repository/account_repository";

export class ListAccountsUsecase {
  constructor(
    private accountRepository: AccountRepository = new AccountRepository()
  ) {}

  async apply(_args: ListAccountsUsecaseArgs) {
    return await this.accountRepository.findAll();
  }
}

export interface ListAccountsUsecaseArgs {}
