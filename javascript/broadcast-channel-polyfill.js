if (!BroadcastChannel) {
    window.BroadcastChannel = (channelName) => {
        var bc = {
            addEventListener: (event, callback) => {
                if (event === 'message') {
                    window.addEventListener('storage', (event) => {
                        if (event.storageArea != localStorage) return;
                        if (event.key === `BroadcastChannel-${channelName}`) {
                            callback({ data: JSON.parse(event.newValue) });
                        }
                    });
                }
            },
            postMessage: (data) => {
                window.localStorage.setItem(`BroadcastChannel-${channelName}`, JSON.stringify(data));
            }
        };
        return bc;
    }
}