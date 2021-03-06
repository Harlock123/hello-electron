const {app, BrowserWindow, shell} = require('electron') 
const url = require('url') 
const path = require('path')
const fs = require('fs')
const os = require('os') 
const ndisk = require('node-disk-info')
const { exec } = require('child_process')
const spawn = require('child_process').spawn



const glob = require("glob-electron")

let UNAME

function GetLeftPanelFiles(foldername) {

    
    fs.readdir(foldername, (err, files) => {
        if (err) {
            throw err;
        }
    
        // files object contains all files names
        // log them on console

        var arr = ['File/Folder Name','File Size','Creation Dat'];

        files.forEach(function (file) {
            // Do whatever you want to do with the file
            
            console.log(file); 
        });
    });
    
}

function TESTFILES(foldername)
{
        
    /* var files = fs.readdirSync(foldername, {withFileTypes: true});

    console.log (files);

    files.forEach(function (file){
        
        //var st = undefined;
        var fullpath = path.join(foldername,file.name);

        fs.statSync(fullpath, (err, fileStats) => {
            if (err) {
              console.log(err);
            } else {
              console.log(fileStats);
            }
          });

        var output = "";
        output += file.name + " ";
        if (file.isSymbolicLink())
            output += 'Simlink';
        if (file.isFile())
            output += 'File';
        if (file.isDirectory())
            output += 'Dir';
        
            console.log(output);
            console.log(fullpath);
            //console.log(st);
    });
    */

    console.log(glob.sync('/*'));
    console.log(glob.sync('/*/'));
}

function getFiles(appDir) {
    const files = fs.readdirSync( appDir );

    return files.map( filename => {
        const filePath = path.resolve( appDir, filename );
        var fff = "WTF";
        var typ = "???"
        var createdDate = "";
        try 
        {
            const fileStats = fs.statSync( filePath );
            if (fileStats.isDirectory())
                typ = "DIR";

            if (fileStats.isFile())
                typ = "FILE";

            if (fileStats.isSymbolicLink())
                typ = "SYM";
            
            if (fileStats.isBlockDevice())
                typ = "BLOCK";

            if (fileStats.isCharacterDevice())
                typ = "CHAR";

            if (fileStats.isFIFO())
                typ = "FIFO";

            if (fileStats.isSocket())
                typ = "SOCK";

            createdDate = formatDate(fileStats.birthtime);

            fff = fileStats;

        }
        catch 
        {
            fff = "WTF";
        }

        if (fff == "WFT")
        {
          
            return {
            name: filename,
            path: filePath,
            size: "???",
            created: createdDate,
            type: typ,
            }
        }
        else
        {    
            var s = "";
            if (Number(fff.size) > 1024 * 1024 * 1024)
                s = Number( fff.size / (1024 * 1024 * 1024) ).toFixed( 3 ) + " G";
            else
                if (Number(fff.size) > 1024 * 1024)
                    s = Number( fff.size / (1024 * 1024) ).toFixed( 2 ) + " M";
                else
                    if (Number(fff.size) > 1024 )
                        s = Number( fff.size / 1024 ).toFixed( 1 ) + " k";
                    else
                        s = Number( fff.size ) + " b";
            return {
            name: filename,
            path: filePath,
            size: s,
            created: createdDate,
            type: typ,
        }
    };
    } );
};

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}

function IsFolderReadable(fname)
{
    try {
        var fresults = getFiles(fname);
        return true;
    }
    catch {
        return false;
    }
}

function MakeFullPath(pth, fname) {

    if (isWin)
        return pth + fname + "\\";
    else
        return pth + fname + "/";
    
}

function POPGridWithFiles (theGrid, Path) {
    var fresults = getFiles(Path);

    var thefiles = [];

    fresults.forEach(element => {

        if (element.size != 'NaN b')
        {

            if (element.type === 'DIR')
            {
                if (IsFolderReadable(MakeFullPath(Path, element.name)))
                {
                    thefiles.push([element.type, element.name,"",element.created]);
                }
            }
            else
            {
                if (element.size == '0.0')
                    thefiles.push([element.type, element.name,"",element.created]);
                else
                    thefiles.push([element.type,element.name,element.size,element.created]);
            }
        }
        
    });
    
    theGrid.SetGridRows(thefiles.sort((a, b) => 
            String(a).localeCompare(String(b), 'en', { sensitivity: 'base' })));
    

}

function CompareTwoElements(a,b) {
    return String(a).toLocaleLowerCase() - String(b).toLocaleLowerCase();
}

function lpathkeyhandler(e)
{
    if (e.code == 'Enter' || e.code == 'numpadenter')
    {
        POPGridWithFiles(LDG,lp.value);

    }
}

function lpathback(e)
{
    let cp = lp.value;
    var retval = "";

    if (isWin)
    {
        var ma = cp.split("\\");
        for(let i=0;i<ma.length-2;i++)
        {
            retval += ma[i] + "\\";
        }

    }
    else
    {
        var ma = cp.split("/");
        for(let i=0;i<ma.length-2;i++)
        {
            retval += ma[i] + "/";
        }

    }

    lp.value = retval;

    POPGridWithFiles(LDG,lp.value);

}

function rpathback(e)
{
    let cp = rp.value;
    var retval = "";

    if (isWin)
    {
        var ma = cp.split("\\");
        for(let i=0;i<ma.length-2;i++)
        {
            retval += ma[i] + "\\";
        }

    }
    else
    {
        var ma = cp.split("/");
        for(let i=0;i<ma.length-2;i++)
        {
            retval += ma[i] + "/";
        }

    }

    rp.value = retval;

    POPGridWithFiles(RDG,rp.value);
}

function rpathkeyhandler(e)
{
    if (e.code == 'Enter' || e.code == 'numpadenter')
    {
        POPGridWithFiles(RDG,rp.value);
    }
}

function HandleRightGridDoubleClick(e) {
    var therow = RDG.CELLCLICKEDINFO.ROWCLICKED;
    var typ = RDG.GridRows[therow][0];
    var fil = RDG.GridRows[therow][1];

    var curpath = rp.value;

    if (typ == "DIR")
    {
        
        if (isWin)
        {
            curpath += fil + "\\" // here we will have to do some env checking
            rp.value = curpath;
        }
        else
        {
            curpath += fil + "/" // here we will have to do some env checking
            rp.value = curpath;
        }
        POPGridWithFiles(RDG,rp.value);

    }
    else
    {
        // Do some other file handler
        // lets try to run the file
        //child.execFile(curpath + fil);
        //spawn(curpath + fil);

        var PTH = curpath + fil;

        if (isLin)
        {
            exec('xdg-open ' + PTH);
        }
        else
        {
            if (isWin)
            {
                shell.openExternal(PTH);
            }
            else
            {
                exec('open ' + PTH);
            }
        }
    }

}

function HandleLeftGridDoubleClick(e) {
    var therow = LDG.CELLCLICKEDINFO.ROWCLICKED;
    var typ = LDG.GridRows[therow][0];
    var fil = LDG.GridRows[therow][1];

    var curpath = lp.value;

    if (typ == "DIR")
    {
        if (isWin)
        {
            curpath += fil + "\\" // here we will have to do some env checking
            lp.value = curpath;
        }
        else
        {
            curpath += fil + "/" // here we will have to do some env checking
            lp.value = curpath;
        }
        
        POPGridWithFiles(LDG,lp.value);

    }
    else
    {
        // Do some other file handler
        // lets try to run the file
        //child.execFile(curpath + fil);
        //spawn(curpath + fil);
        var PTH = curpath + fil;

        if (isLin)
        {
            exec('xdg-open ' + PTH);
        }
        else
        {
            if (isWin)
            {
                shell.openExternal(PTH);
            }
            else
            {
                exec('open ' + PTH);
            }
        }
    }

}

function HandleRightGridMousedOver(e) {

    document.getElementById('leftpanel').style.backgroundColor = 'grey';
    document.getElementById('rightpanel').style.backgroundColor = 'red';
    

}

function HandleLeftGridMousedOver(e) {
    document.getElementById('leftpanel').style.backgroundColor = 'red';
    document.getElementById('rightpanel').style.backgroundColor = 'grey';
    
}

function RootSysHandler()
{
    if (isWin)
    {
        POPGridWithFiles(LDG,'C:\\');
        POPGridWithFiles(RDG,os.homedir() + "\\");

        lp.value = "C:\\";
        rp.value = os.homedir() + "\\";
    }
    else
    {
        POPGridWithFiles(LDG,'/');
        POPGridWithFiles(RDG,os.homedir() + "/");

        lp.value = "/";
        rp.value = os.homedir() + "/";
    }
}

function printResults(title, disks) {

    console.log(`============ ${title} ==============\n`);

    for (const disk of disks) {
        console.log('Filesystem:', disk.filesystem);
        console.log('Blocks:', disk.blocks);
        console.log('Used:', disk.used);
        console.log('Available:', disk.available);
        console.log('Capacity:', disk.capacity);
        console.log('Mounted:', disk.mounted, '\n');
    }
}

try {
    const disks = ndisk.getDiskInfoSync();
    printResults('SYNC WAY', disks);
} catch (e) {
    console.error(e);
}

//console.log(os.userInfo());
UNAME = os.userInfo().username;
//console.log(UNAME);

var rcvs = document.getElementById('rightcanvas');
var lcvs = document.getElementById('leftcanvas');

// Wire up Doubleclicks
rcvs.addEventListener('CELLDOUBLECLICKED', HandleRightGridDoubleClick, true);
lcvs.addEventListener('CELLDOUBLECLICKED', HandleLeftGridDoubleClick, true);

rcvs.addEventListener('MOUSEDOVER',HandleRightGridMousedOver,true);
lcvs.addEventListener('MOUSEDOVER',HandleLeftGridMousedOver,true);


var lp = document.getElementById('lpath');
var rp = document.getElementById('rpath');

lp.addEventListener('keydown',lpathkeyhandler);
rp.addEventListener('keydown',rpathkeyhandler);

LCTDataGrid: RDG = new LCTDataGrid(rcvs);
LCTDataGrid: LDG = new LCTDataGrid(lcvs);

RDG.DoConsoleLogging = false;
LDG.DoConsoleLogging = false;

RDG.FillCanvas();
LDG.FillCanvas();

var isWin = process.platform === "win32";
var isMac = process.platform === "darwin";
var isLin = process.platform === "linux";


