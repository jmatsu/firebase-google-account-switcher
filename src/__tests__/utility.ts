import {
  getProjectId,
  setAutoSwitchEnabled,
  isAutoSwitchEnabled
} from "../utility";
import {
  createDummyChromeStorage,
  createDummyLocation
} from "../testLib/dummy";

test("get a project id from a URL", () => {
  const url =
    "https://console.firebase.google.com/u/0/project/<project id>/<...>";

  createDummyLocation(url);

  expect(getProjectId()).toBe("<project id>");
});

test("set a flag to switch autocatically from chrome storage", async () => {
  const chrome = createDummyChromeStorage();

  spyOn(chrome.storage.sync, "set").and.callThrough();

  await setAutoSwitchEnabled(true);

  expect(chrome.storage.sync.set).toHaveBeenLastCalledWith<any[]>(
    {
      autoSwitch: true
    },
    jasmine.anything()
  );

  await setAutoSwitchEnabled(false);

  expect(chrome.storage.sync.set).toHaveBeenLastCalledWith<any[]>(
    {
      autoSwitch: false
    },
    jasmine.anything()
  );
});

describe("get a flag to switch autocatically from chrome storage", () => {
  it("return false", async () => {
    const chrome = createDummyChromeStorage({ autoSwitch: false });

    spyOn(chrome.storage.sync, "get").and.callThrough();

    expect(await isAutoSwitchEnabled()).toBeFalsy();

    expect(chrome.storage.sync.get).toHaveBeenLastCalledWith<any[]>(
      {
        autoSwitch: false
      },
      jasmine.anything()
    );
  });

  it("return true", async () => {
    const chrome = createDummyChromeStorage({ autoSwitch: true });

    spyOn(chrome.storage.sync, "get").and.callThrough();

    expect(await isAutoSwitchEnabled()).toBeTruthy();

    expect(chrome.storage.sync.get).toHaveBeenLastCalledWith<any[]>(
      {
        autoSwitch: false
      },
      jasmine.anything()
    );
  });
});
