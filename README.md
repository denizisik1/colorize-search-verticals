#### Google Search Verticals

A Firefox addon that stops Google from reshuffling the search tabs.

Google reorders Images, Videos, Maps, News and the rest based on the query. Muscle memory breaks: the second tab is not always Images. This addon pins All, Images, Videos, Maps, News, and Shopping in that order, tucks the rare ones under More, and gives each tab its own muted color and pattern.

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

- Android no longer works, DOM must have changed needs fixing.
- Make it so that it removes all quickly and show only when ready, on very slow
machines it shows the old version for a second or two and changes right when
you're ready to click.
- Swap AI Mode with news including their colors, or add it as another thing.

