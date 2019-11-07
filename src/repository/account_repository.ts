import { Account, AccountId } from "../domain/account";
import { Email, ProjectId } from "../domain/valueobject";

export default class AccountRepository {
  async findAll(): Promise<Account[]> {
    return new Promise(resolver => {
      chrome.storage.sync.get(
        {
          accounts: new Array<Account>(0)
        },
        (items: { accounts: Account[] }) => {
          resolver(items.accounts);
        }
      );
    });
  }

  async findByEmail(email: Email): Promise<Account | null> {
    const accounts = await this.findAll();
    return accounts.find(account => account.email === email);
  }

  async findAllByProjectId(projectId: ProjectId): Promise<Account[]> {
    const accounts = await this.findAll();
    return accounts.filter(
      account => account.associatedProjectIds.indexOf(projectId) >= 0
    );
  }

  async save(account: Account) {
    this.updateAll(account);
  }

  async updateAll(...accounts: Account[]) {
    const currentAccounts = await this.findAll();
    const accountMap = {};

    currentAccounts.forEach(cur => {
      accountMap[cur.id] = cur;
    });
    accounts.forEach(account => {
      accountMap[account.id] = account;
    });
    const newAccounts = Object.keys(accountMap).map(key => accountMap[key]);

    return new Promise(resolver => {
      chrome.storage.sync.set(
        {
          accounts: newAccounts
        },
        () => resolver()
      );
    });
  }

  async delete(id: AccountId) {
    const accounts = await this.findAll();
    return new Promise(resolver => {
      chrome.storage.sync.set(
        {
          accounts: accounts.filter(account => account.id !== id)
        },
        () => resolver()
      );
    });
  }
}
