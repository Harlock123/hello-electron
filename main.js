const {app, BrowserWindow} = require('electron') 
const url = require('url') 
const path = require('path')
const os = require('os')  

let win 
let OS 
let UNAME 

function createWindow() { 
   win = new BrowserWindow({width: 800, 
                            height: 600,
                            minWidth: 640,
                            minHeight: 480, 
                            icon: __dirname + '/assets/Icons/tux-icon.png',
                            title: 'Opus Tool experimental',
                            webPreferences: {
                                 nodeIntegration: true,
                                 contextIsolation: false,
                                 autoHideMenuBar: true
  }}) 
   win.setMenuBarVisibility(false);
   win.loadURL(url.format ({ 
      pathname: path.join(__dirname, 'index.html'), 
      protocol: 'file:', 
      slashes: true 
   })) 
   
   //OS = os;
   //console.log(OS.userInfo());
   //UNAME = OS.userInfo().username;
   //console.log(UNAME);

   //$scope.username = UNAME;

} 

app.on('ready', createWindow)
 
