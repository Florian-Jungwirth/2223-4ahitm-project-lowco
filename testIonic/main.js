const { app, BrowserWindow } = require('electron');

function createWindow() {
    const mainWindow = new BrowserWindow({
        width:600,
        height: 800
    });

    mainWindow.loadURL('http://localhost:8100');
    
    mainWindow.on('closed', function () {
        app.quit();
    });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', function () {
    if(process.platform !== 'darwin') app.quit();
});

app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
})