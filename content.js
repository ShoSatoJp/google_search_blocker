function injectScript(parent, path) {
    const e = document.createElement('script');
    if (typeof 'chrome' !== 'undefined') {
        e.setAttribute('src', chrome.extension.getURL(path));
    } else if (typeof 'browser' !== 'undefined') {
        e.setAttribute('src', browser.runtime.getURL(path));
    }
    parent.appendChild(e);
}

window.addEventListener('DOMContentLoaded', () => {
    injectScript(document.body, '/google_search_blocker.user.js');
});
const Messenger = (() => {
    const Messenger = function (event_name, name) {
        const self = this;
        self.EVENT_NAME = event_name;
        self.NAME = name;
        self.messageId = 0;
        self.messageQueue = [];

        document.addEventListener(self.EVENT_NAME, e => {
            const data = JSON.parse(e.detail);
            if (data.receiver === self.NAME) {
                const message = self.messageQueue.find(e => e.messageId === data.prevMessageId);
                if (message) {
                    // response
                    self.messageQueue = self.messageQueue.filter(e => e.messageId !== message.messageId);
                    message.callback(data);
                } else {
                    // incoming
                    if (self.onmessage) {
                        self.onmessage(data);
                    }
                }
            }
        });
    };

    Messenger.prototype.send = async function (receiver, data, prevMessageId = null, sendOnly = false) {
        const self = this;
        data.prevMessageId = prevMessageId;
        data.messageId = self.NAME + self.messageId++;
        data.receiver = receiver;
        data.sender = self.NAME;
        const e = new CustomEvent(self.EVENT_NAME, {
            detail: JSON.stringify(data),
        });

        if (sendOnly) {
            document.dispatchEvent(e);
        } else {
            return await new Promise((res, rej) => {
                self.messageQueue.push({
                    callback: (response) => {
                        res(response);
                    },
                    messageId: data.messageId
                });
                document.dispatchEvent(e);
            });
        }
    };

    Messenger.prototype.onmessage = function (data) { };

    return Messenger;
})();

const m = new Messenger('shosato.jp', 'content');
m.onmessage = function (data) {
    m.sendOnly(data.sender, { aaa: 'hogehoge' }, data.messageId, true);
}