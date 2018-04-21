const { ipcMain } = require('electron');
const notifier = require('node-notifier');
const path = require('path');
/**
 * arg: {
 *  type: string, // basic, picture, ...
 * }
 */
ipcMain.on('notification', (event, arg) => {
    // write switch case on arg.type for different type of notifications (https://www.npmjs.com/package/node-notifier)
    switch (arg.type) {
        case 'FOUR':
            data = arg.data;
            data.sound = true;
            data.icon = path.join(__dirname, 'logo.png');
            data.contentImage = path.join(__dirname, 'four.png');
            data.closeLabel = 'Close';
            notifier.notify(arg.data);
            break;
        case 'SIX':
            data = arg.data;
            data.sound = true;
            data.icon= path.join(__dirname, 'logo.png');
            data.contentImage = path.join(__dirname, 'six.png');
            data.closeLabel = 'Close';
            notifier.notify(arg.data);
            break;
        case 'WICKET':
            data = arg.data;
            data.sound = true;
            data.icon=  path.join(__dirname, 'logo.png');
            data.contentImage = path.join(__dirname, 'wicket.png');
            data.closeLabel = 'Close';
            notifier.notify(arg.data);
            break;
        default:
            notifier.notify(arg.data);
            break;
    }
})