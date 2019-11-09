import { Email, ProjectId } from "../domain/valueobject";
import AccountRepository from "../repository/account_repository";
import { Account } from "../domain/account";
import { isAutoSwitchEnabled } from "../utility";

export class SwitchAccountUsecase {
  constructor(
    private accountRepository: AccountRepository = new AccountRepository()
  ) {}

  async apply(args: SwitchAccountUsecaseArgs) {
    const account = await this.accountRepository.findByEmail(args.email);

    if (!account) {
      throw new Error("an account was not found");
    }

    if (await isAutoSwitchEnabled()) {
      account.associatedProjectIds.push(args.projectId);
      await this.accountRepository.save(account);
    }

    this.switchAccount(account);
  }

  switchAccount = (item: Email | Account) => {
    const email = (item as any).email || item; // dirty
    const newUrl = `${location.href}&authuser=${email}`;
    location.href = newUrl;
    return newUrl;
  };
}

export interface SwitchAccountUsecaseArgs {
  email: Email;
  projectId: ProjectId;
}
