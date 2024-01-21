import { app, BrowserWindow, globalShortcut, ipcMain, clipboard } from 'electron'
import path from 'node:path'
const {keyboard, Key} = require('@nut-tree/nut-js');


async function pasteFromHistory(arg: string) {
  
      try
      {
        await clipboard.writeText(arg, "selection");
        await keyboard.pressKey(Key.LeftControl, Key.V);
    }
    catch (error)
    {
      console.log("PASE FROM HISTORY ERROR ++++ ", error)
    }
}
async function getClipboardText(arg: string) {
  const tempWindow = new BrowserWindow({ show: false })  
  await pasteFromHistory(arg)  
  tempWindow.close()
}
console.log("Done")


ipcMain.handle('close-me', async (event, arg) => {
    
  // Get window that sent the message
  const window = BrowserWindow.fromWebContents(event.sender);  
  console.log(arg)
  if (window)
  {
    // Close the window 
    getClipboardText(arg);
    window.close();
  }
  // await pasteFromHistory();
  console.log("OPIIUOIUIUOI")
  
});


// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.js
// │
process.env.DIST = path.join(__dirname, '../dist')
process.env.VITE_PUBLIC = app.isPackaged ? process.env.DIST : path.join(process.env.DIST, '../public')


let win: BrowserWindow | null
// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']

function createWindow(show: boolean) {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false
    },
    // frame: false,
    // titleBarStyle: 'hidden',
    // titleBarOverlay: {
    //   color: '#2f3241',
    //   symbolColor: '#74b1be',
    //   height: 30,
    //   // borde: 
    // }
    transparent: true ,
    show: show

  })




  // win.setWindowButtonVisibility(true)



  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(process.env.DIST, 'index.html'))
  }
  return win
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow(false)
  }
})

app.whenReady().then(() =>
{
  var main = createWindow(false)

  var shortcut = 'shift+CommandOrControl+C'; 

  // // Register global shortcut listener    
  globalShortcut.register(shortcut, () => {
    console.log("YO C PRESSED", clipboard.readText('selection'))
    main.show();
    
    // Open new window when shortcut pressed
    main?.webContents.send("Open-Copy");
  })

  var shortcut = 'shift+CommandOrControl+V'; 

  // // Register global shortcut listener    
  globalShortcut.register(shortcut, () => {
    console.log("YO V PRESSED")
    main.show();
    // Open new window when shortcut pressed
    main?.webContents.send("Open-Paste");
  })



})

