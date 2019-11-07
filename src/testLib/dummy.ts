export interface Chrome {
  storage: {
    sync: {
      get: (arg1: any, arg2: Function) => void;
      set: (arg1: any, arg2: Function) => void;
    };
  };
}

export interface Location {
  href: string;
}

export const createDummyChromeStorage: (args?: any) => Chrome = args => {
  const storageGet = (_, callback) => callback(args);
  const storageSet = (_, callback) => callback();
  const sync = {
    get: storageGet,
    set: storageSet
  };

  globalThis.window = Object.create(window);
  const chrome = {
    storage: {
      sync
    }
  };
  Object.defineProperty(window, "chrome", {
    value: chrome,
    writable: true
  });
  return chrome;
};

export const createDummyLocation: (string) => Location = url => {
  globalThis.window = Object.create(window);
  const location = {
    href: url
  };
  Object.defineProperty(window, "location", {
    value: location,
    writable: true
  });
  return location;
};
