import { createDummyChromeStorage } from "../../testLib/dummy";
import { Account } from "../../domain/account";
import AccountRepository from "../account_repository";

let repository: AccountRepository = null;

beforeEach(() => {
  repository = new AccountRepository();
});

describe("findAll", () => {
  it("should return accounts which are saved in chrome", async () => {
    const expectedAccounts: Account[] = [
      {
        id: "id",
        email: "jmatsu@example.com",
        associatedProjectIds: []
      },
      {
        id: "id2",
        email: "jmatsu2@example.com",
        associatedProjectIds: []
      },
      {
        id: "id3",
        email: "jmatsu3@example.com",
        associatedProjectIds: []
      }
    ];
    const chrome = createDummyChromeStorage({ accounts: expectedAccounts });

    spyOn(chrome.storage.sync, "get").and.callThrough();

    const accounts = await repository.findAll();

    expect(accounts).toEqual(expectedAccounts);

    expect(chrome.storage.sync.get).toHaveBeenCalledWith<any[]>(
      {
        accounts: []
      },
      jasmine.anything()
    );
  });
});

describe("findByEmail", () => {
  it("should return an account whose email is same", async () => {
    const accounts: Account[] = [
      {
        id: "id",
        email: "jmatsu@example.com",
        associatedProjectIds: []
      },
      {
        id: "id2",
        email: "jmatsu2@example.com",
        associatedProjectIds: []
      }
    ];

    spyOn(repository, "findAll").and.returnValue(Promise.resolve(accounts));

    const account = await repository.findByEmail("jmatsu2@example.com");

    expect(account).toEqual({
      id: "id2",
      email: "jmatsu2@example.com",
      associatedProjectIds: []
    });

    expect(repository.findAll).toHaveBeenCalled();
  });

  it("should return an undefined if none matches", async () => {
    const accounts: Account[] = [
      {
        id: "id",
        email: "jmatsu@example.com",
        associatedProjectIds: []
      },
      {
        id: "i2",
        email: "jmatsu2@example.com",
        associatedProjectIds: []
      }
    ];
    spyOn(repository, "findAll").and.returnValue(Promise.resolve(accounts));

    const account = await repository.findByEmail("jmatsu3@example.com");

    expect(account).toBeUndefined();

    expect(repository.findAll).toHaveBeenCalled();
  });
});

describe("findAllByProjectId", () => {
  it("should return accounts whose project ids are same", async () => {
    const accounts: Account[] = [
      {
        id: "id",
        email: "jmatsu@example.com",
        associatedProjectIds: ["project_id"]
      },
      {
        id: "id2",
        email: "jmatsu2@example.com",
        associatedProjectIds: ["project_id2"]
      },
      {
        id: "id3",
        email: "jmatsu3@example.com",
        associatedProjectIds: ["project_id3", "project_id"]
      }
    ];

    spyOn(repository, "findAll").and.returnValue(Promise.resolve(accounts));

    expect(await repository.findAllByProjectId("project_id")).toEqual([
      {
        id: "id",
        email: "jmatsu@example.com",
        associatedProjectIds: ["project_id"]
      },
      {
        id: "id3",
        email: "jmatsu3@example.com",
        associatedProjectIds: ["project_id3", "project_id"]
      }
    ]);

    expect(repository.findAll).toHaveBeenCalled();
  });
});

describe("save", () => {
  it("should call updateAll with just one argument", async () => {
    const account: Account = {
      id: "id",
      email: "jmatsu@example.com",
      associatedProjectIds: ["project_id"]
    };

    spyOn(repository, "updateAll").and.returnValue(Promise.resolve());

    await repository.save(account);

    expect(repository.updateAll).toHaveBeenCalledWith<Account[]>(account);
  });
});

describe("updateAll", () => {
  it("should set accounts to chrome", async () => {
    const newAccounts: Account[] = [
      {
        id: "id",
        email: "jmatsu@example.com",
        associatedProjectIds: ["project_id"]
      },
      {
        id: "id2",
        email: "jmatsu2@example.com",
        associatedProjectIds: []
      }
    ];

    spyOn(repository, "findAll").and.returnValue(Promise.resolve([]));

    const chrome = createDummyChromeStorage();

    spyOn(chrome.storage.sync, "set").and.callThrough();

    await repository.updateAll(...newAccounts);

    expect(repository.findAll).toHaveBeenCalled();

    expect(chrome.storage.sync.set).toHaveBeenCalledWith<any[]>(
      {
        accounts: [
          {
            id: "id",
            email: "jmatsu@example.com",
            associatedProjectIds: ["project_id"]
          },
          {
            id: "id2",
            email: "jmatsu2@example.com",
            associatedProjectIds: []
          }
        ]
      },
      jasmine.anything()
    );
  });

  it("should overwrite existing accounts", async () => {
    const overwritee: Account = {
      id: "id",
      email: "jmatsu@example.com",
      associatedProjectIds: []
    };

    const newAccount: Account = {
      id: "id",
      email: "jmatsu@example.com",
      associatedProjectIds: ["project_id"]
    };

    expect(overwritee).not.toEqual(newAccount);

    const currentAccounts: Account[] = [
      overwritee,
      {
        id: "id2",
        email: "jmatsu2@example.com",
        associatedProjectIds: []
      }
    ];

    spyOn(repository, "findAll").and.returnValue(
      Promise.resolve(currentAccounts)
    );

    const chrome = createDummyChromeStorage();

    spyOn(chrome.storage.sync, "set").and.callThrough();

    await repository.updateAll(newAccount);

    expect(repository.findAll).toHaveBeenCalled();

    expect(chrome.storage.sync.set).toHaveBeenCalledWith<any[]>(
      {
        accounts: [
          newAccount,
          {
            id: "id2",
            email: "jmatsu2@example.com",
            associatedProjectIds: []
          }
        ]
      },
      jasmine.anything()
    );
  });
});

describe("delete", () => {
  it("should delete an account from stored data", async () => {
    const accounts: Account[] = [
      {
        id: "id",
        email: "jmatsu@example.com",
        associatedProjectIds: []
      },
      {
        id: "id2",
        email: "jmatsu2@example.com",
        associatedProjectIds: []
      }
    ];

    spyOn(repository, "findAll").and.returnValue(Promise.resolve(accounts));

    const chrome = createDummyChromeStorage();

    spyOn(chrome.storage.sync, "set").and.callThrough();

    await repository.delete("id");

    expect(repository.findAll).toHaveBeenCalled();

    expect(chrome.storage.sync.set).toHaveBeenCalledWith<any[]>(
      {
        accounts: [
          {
            id: "id2",
            email: "jmatsu2@example.com",
            associatedProjectIds: []
          }
        ]
      },
      jasmine.anything()
    );
  });
});
