import AccountRepository from "../repository/account_repository";
import { AccountId } from "../domain/account";

export class DeleteAccountUsecase {
  constructor(
    private accountRepository: AccountRepository = new AccountRepository()
  ) {}

  async apply(args: DeleteAccountUsecaseArgs) {
    await this.accountRepository.delete(args.id);
  }
}

export interface DeleteAccountUsecaseArgs {
  id: AccountId;
}
