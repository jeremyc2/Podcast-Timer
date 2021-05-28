if (!window.BroadcastChannel) {
    window.BroadcastChannel = class {
        constructor(channelName) {
            this.channelName = channelName;
        }

        addEventListener(event, callback) {
            if (event === 'message') {
                window.addEventListener('storage', (event) => {
                    if (event.storageArea != localStorage) return;
                    if (event.key === `BroadcastChannel-${this.channelName}`) {
                        if(event.newValue == null) return;
                        callback({ data: JSON.parse(event.newValue) });
                    }
                });
            }
        }

        postMessage(data) {
            window.localStorage.removeItem(`BroadcastChannel-${this.channelName}`);
            window.localStorage.setItem(`BroadcastChannel-${this.channelName}`, JSON.stringify(data));
        }
    }
}