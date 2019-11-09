import {
  createDummyChromeStorage,
  Chrome,
  createDummyLocation,
  Location
} from "../dummy";

describe("chrome dummy", () => {
  let chrome: Chrome = null;

  beforeEach(() => {
    chrome = createDummyChromeStorage();
  });

  it("get should execute a callback surely", async () => {
    await new Promise(resolver => {
      chrome.storage.sync.get(true, () => {
        resolver();
      });
    });

    // it's okay if no timeout happens
    expect(true).toBeTruthy();
  });

  it("set should execute a callback surely", async () => {
    await new Promise(resolver => {
      chrome.storage.sync.set(true, () => {
        resolver();
      });
    });

    // it's okay if no timeout happens
    expect(true).toBeTruthy();
  });
});

describe("location dummy", () => {
  let location: Location = null;
  const url = "https://example.com";

  beforeEach(() => {
    location = createDummyLocation(url);
  });

  it("href should return url", () => {
    expect(location.href).toEqual(url);
  });

  it("href should be assignable", () => {
    location.href = "xyz";
    expect(location.href).toEqual("xyz");
  });
});
