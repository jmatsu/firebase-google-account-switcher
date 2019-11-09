import {
  SwitchAccountUsecase,
  SwitchAccountUsecaseArgs
} from "../switch_account_usecase";
import AccountRepository from "../../repository/account_repository";
import { Account } from "../../domain/account";
import { Email } from "../../domain/valueobject";
import {
  createDummyLocation,
  createDummyChromeStorage
} from "../../testLib/dummy";

describe("non entry points", () => {
  const url =
    "https://console.firebase.google.com/u/0/project/projectId/xxxxx?xyz=abc";

  beforeEach(() => {
    createDummyLocation(url);
  });

  it("switchAccount appends a given email with & to the URL", () => {
    const repository = <AccountRepository>{};
    const usecase = new SwitchAccountUsecase(repository);
    expect(usecase.switchAccount("sample@example.com")).toBe(
      `${url}&authuser=sample@example.com`
    );
  });

  it("switchAccount appends a given account's email with & to the URL", () => {
    const repository = <AccountRepository>{};
    const usecase = new SwitchAccountUsecase(repository);
    expect(
      usecase.switchAccount({
        id: "id",
        email: "sample@example.com",
        associatedProjectIds: []
      })
    ).toBe(`${url}&authuser=sample@example.com`);
  });
});

describe("entrypoint", () => {
  it("a usecase should append a project id if isAutoSwitch is enabled", async () => {
    createDummyChromeStorage({ autoSwitch: true });

    const account: Account = {
      id: "id",
      email: "sample@example.com",
      associatedProjectIds: []
    };

    const repository = new AccountRepository();
    spyOn(repository, "save").and.returnValue(Promise.resolve());
    spyOn(repository, "findByEmail").and.returnValue(Promise.resolve(account));

    const usecase = new SwitchAccountUsecase(repository);
    const args: SwitchAccountUsecaseArgs = {
      email: "sample@example.com",
      projectId: "project_id"
    };
    await usecase.apply(args);

    expect(repository.findByEmail).toHaveBeenCalledWith<Email[]>(args.email);

    expect(repository.save).toHaveBeenCalledWith<Account[]>({
      id: account.id,
      email: account.email,
      associatedProjectIds: ["project_id"]
    });
  });

  it("a usecase should not append a project id unless isAutoSwitch is enabled", async () => {
    createDummyChromeStorage({ autoSwitch: false });

    const account: Account = {
      id: "id",
      email: "sample@example.com",
      associatedProjectIds: []
    };

    const repository = new AccountRepository();

    spyOn(repository, "save").and.returnValue(Promise.resolve());
    spyOn(repository, "findByEmail").and.returnValue(Promise.resolve(account));

    const usecase = new SwitchAccountUsecase(repository);
    const args: SwitchAccountUsecaseArgs = {
      email: "sample@example.com",
      projectId: "project_id"
    };
    await usecase.apply(args);

    expect(repository.findByEmail).toHaveBeenCalledWith<Email[]>(args.email);

    expect(repository.save).not.toHaveBeenCalled();
  });
});
