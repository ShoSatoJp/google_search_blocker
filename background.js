chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log(message);
    const data = JSON.parse(message);
    sendResponse('hoge');
    // sendResponse(chrome.runtime.getURL(...data.args));
});
chrome.tabs.onMessage.addListener((message, sender, sendResponse) => {
    console.log(message);
    sendResponse('hoge');
    // sendResponse(chrome.runtime.getURL(...data.args));
});

console.log('hogehoge')

setInterval(() => {
    console.log('===');
}, 1000);