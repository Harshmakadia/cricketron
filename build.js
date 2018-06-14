var electronInstaller = require('electron-winstaller');
resultPromise = electronInstaller.createWindowsInstaller({
    appDirectory: './builds/Cricketron-win32-x64',
    outputDirectory: './builds/Cricketron64',
    authors: 'Cricketron Inc',
    exe: 'cricketron.exe'
});

resultPromise.then(() => console.log("It worked!"), (e) => console.log(`No dice: ${e.message}`));