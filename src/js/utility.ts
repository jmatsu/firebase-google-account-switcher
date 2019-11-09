import * as $ from "jquery";

export const doThen = (
  condition: () => boolean,
  func: () => void,
  tryIndex: number = 0
) => {
  setTimeout(() => {
    if (condition()) {
      func();
    } else if (tryIndex < 6) {
      doThen(condition, func, tryIndex + 1);
    } else {
      return;
    }
  }, 500);
};

export const getProjectId = () => {
  // https://console.firebase.google.com/u/0/project/<project id>/<...>
  return location.href
    .substring(
      "https://console.firebase.google.com/u/".length,
      location.href.length
    )
    .split("/")[2];
};

export const isShowingError = () =>
  !!$("console-corp-error-details").attr("error-details");
export const isForbiddenError = () =>
  $("console-corp-error-details")
    .attr("error-details")
    .indexOf("403") > 0;

export const isAutoSwitchEnabled = async () =>
  new Promise<boolean>(resolver => {
    chrome.storage.sync.get(
      {
        autoSwitch: false
      },
      (items: { autoSwitch: boolean }) => {
        resolver(items.autoSwitch);
      }
    );
  });

export const setAutoSwitchEnabled = async (enabled: boolean) =>
  new Promise(resolver => {
    chrome.storage.sync.set(
      {
        autoSwitch: enabled
      },
      () => {
        resolver();
      }
    );
  });
