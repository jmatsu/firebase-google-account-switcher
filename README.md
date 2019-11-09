# Chrome Extension : Google Account Switcher for Firebase Projects

A Google Chrome extension allows to switch accounts without frustrations when a selected account does not have permission to see a Firebase project.

<a href="https://chrome.google.com/webstore/detail/google-account-switcher-f/ebmkkoeipcbkdcmkbkfmbadifogpdjcb" target="_blank">![chrome web store](https://developer.chrome.com/webstore/images/ChromeWebStore_BadgeWBorder_v2_206x58.png)</a>

## Motivation

Currently, Firebase does not have a Google account switcher like other Google pages. So we need to modify the user's index in the URL of Firebase Project if `authuser-index <n>` does not have permission to see the project... it's terrible!

## Development

```
$ yarn install --frozen-version
$ yarn watch
```

And then, please load `dist` directory from your Google Chrome.

```
# Run tests
$ yarn test
```

