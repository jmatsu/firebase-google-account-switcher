chrome.runtime.onMessage.addListener(message => {
  switch (message.action) {
    case "openOptionsPage":
      openOptionsPage();
      break;
    default:
      break;
  }
});

const openOptionsPage = () => {
  chrome.runtime.openOptionsPage();
};
