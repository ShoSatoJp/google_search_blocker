chrome.webNavigation.onCommitted.addListener((e) => {
    console.log(e);
    if (e.parentFrameId === -1) {
        chrome.tabs.executeScript(e.tabId, {
            file: './google_search_blocker.user.js'
        });
    }
});
chrome.webNavigation.onDOMContentLoaded.addListener(e => {
    console.log('dom', e)
})