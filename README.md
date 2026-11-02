#### Google Search Verticals

A Firefox addon that stops Google from reshuffling the search tabs.

Google reorders Images, Videos, Maps, News and the rest based on the query. Muscle memory breaks: the second tab is not always Images. This addon pins All, Images, Videos, Maps, AI Mode, and Shopping in that order, tucks the rare ones under More, and gives each tab its own muted color and pattern.

![Pinned search tabs, each with its own color](misc/demo.png)

Works in Firefox for desktop and Firefox for Android. Listed on [addons.mozilla.org](https://addons.mozilla.org/addon/google-search-tab-colorizer/).

##### Local Install (desktop)

1. Open `about:debugging` in Firefox
2. Choose **This Firefox**
3. Click **Load Temporary Add-on**
4. Select `manifest.json` in this repository

##### Firefox for Android

Install it from the add-on page in Firefox for Android (113 or later) after this version is published.

To try a local build on a phone, connect the device over USB and follow [Mozilla's Android extension docs](https://extensionworkshop.com/documentation/develop/developing-extensions-for-firefox-for-android/).

##### Tasklist

- Android no longer works, DOM must have changed needs fixing. Once ready readd the deleted section in manifest.json file.

- When videos is clicked, the position of videos and all flicker (quickly swap places back and forth) like multiple times then stop. Not a huge deal but it is a design bug.

