import { Email } from "../domain/valueobject";
import AccountRepository from "../repository/account_repository";

export class CreateAccountUsecase {
  constructor(
    private accountRepository: AccountRepository = new AccountRepository()
  ) {}

  async apply(args: CreateAccountUsecaseArgs) {
    const email = args.email;
    const accountId = email;
    const associatedProjectIds = [];
    const account = {
      id: accountId,
      email,
      associatedProjectIds
    };

    await this.accountRepository.save(account);
    return account;
  }
}

export interface CreateAccountUsecaseArgs {
  email: Email;
}
