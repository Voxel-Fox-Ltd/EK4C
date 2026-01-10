browser.runtime.onInstalled.addListener(async (details) => {
  // Run only on first install, not on updates
  if (details.reason !== "install") {
    return;
  }
  await browser.runtime.openOptionsPage();
});
