import { app, BrowserWindow, globalShortcut, ipcMain } from 'electron'
import path from 'node:path'
import {keyboard, Key} from '@nut-tree/nut-js'

ipcMain.handle('close-me', async (event, arg) => {
    
  // Get window that sent the message
  const window = BrowserWindow.fromWebContents(event.sender);  
  console.log(arg)
  if (window)
  {
    // Close the window 
    window.close();
  }
  // await keyboard.pressKey(Key.LeftControl, Key.V);
  
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

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false
    },
  })

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
    createWindow()
  }
})





async function pasteFromHistory() {
  
  // Get clipboard text from main process  
  // const text = await ipcRenderer.invoke('get-clipboard-history');
  
  // Check if a selection exists on current screen
  // const selection = document.getSelection();
  
  // if (selection) {
    //   // Overwrite selection with clipboard text
    //   selection.deleteFromDocument();  
    //   selection.insertNode(document.createTextNode(text));
    
    // } else {
      // Fallback to normal paste if no selection
      console.log("ASDSADSADSAD")
      try
      {
        // await keyboard.type(Key.LeftSuper, Key.Space);
        // console.log(process.version)
        // console.log(navigator)
        //     const text = 'hello i am a bit of text!'
        const a = await keyboard.type('oo');
        console.log(a)

        // await keyboard.type('Hello World!').then(()=>console.log("DONE")).catch((err) => console.log("ERRORRRRR", err));
  // clipboard.writeText(text)
  // console.log("YO")
  // robot.keyTap('v', process.platform === 'darwin' ? 'command' : 'control');


    }
    catch (error)
    {
      console.log("PASE FROM HISTORY ERROR ++++ ", error)
    }
    // await navigator.clipboard.writeText("text").then(()=> console.log("SUCESS")).catch(()=>console.log("ERROR"))
    // document.execCommand('Paste')

  // }
}


app.whenReady().then(() =>
{
  createWindow()
  
  

  const shortcut = 'CommandOrControl+X'; 

  // Register global shortcut listener    
  globalShortcut.register(shortcut, () => {
    
    // Open new window when shortcut pressed
    pasteFromHistory();  
    
  })

})

