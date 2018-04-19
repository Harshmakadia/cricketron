const { ipcMain } = require('electron');
const notifier = require('node-notifier');

/**
 * arg: {
 *  type: string, // basic, picture, ...
 * }
 */
ipcMain.on('notification', (event, arg) => {
    // write switch case on arg.type for different type of notifications (https://www.npmjs.com/package/node-notifier)
    switch (arg.type) {
        case 'basic':
            notifier.notify(arg.data);
            break;
        default:
            break;
    }
})