const {app, BrowserWindow} = require('electron') 
const url = require('url') 
const path = require('path')
const fs = require('fs')
const os = require('os') 

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

function POPGridWithFiles (theGrid, Path) {
    var fresults = getFiles(Path);

    var thefiles = [];

    fresults.forEach(element => {

        if (element.size != 'NaN b')
        {
            if (element.size == '0.0')
                thefiles.push([element.type, element.name,"",element.created]);
            else
                thefiles.push([element.type,element.name,element.size,element.created]);
        }
        
    });

    theGrid.GridRows = thefiles;
    theGrid.FillCanvas();


}

function lpathkeyhandler(e)
{
    if (e.code == 'Enter' || e.code == 'numpadenter')
    {
        POPGridWithFiles(LDG,lp.value);

    }
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
        curpath += fil + "/" // here we will have to do some env checking
        rp.value = curpath;
        
        POPGridWithFiles(RDG,rp.value);

    }
    else
    {
        // Do some other file handler
    }

}

function HandleLeftGridDoubleClick(e) {
    var therow = LDG.CELLCLICKEDINFO.ROWCLICKED;
    var typ = LDG.GridRows[therow][0];
    var fil = LDG.GridRows[therow][1];

    var curpath = lp.value;

    if (typ == "DIR")
    {
        curpath += fil + "/" // here we will have to do some env checking
        lp.value = curpath;
        
        POPGridWithFiles(LDG,lp.value);

    }
    else
    {
        // Do some other file handler
    }

}

function TestButtonHandler()
{
    POPGridWithFiles(LDG,'C:/windows/'); 
    POPGridWithFiles(RDG,'./');

    document.getElementById('lpath').value = "C:/windows/";
    document.getElementById('rpath').value = "./";

}

//console.log(os.userInfo());
UNAME = os.userInfo().username;
//console.log(UNAME);

var rcvs = document.getElementById('rightcanvas');
var lcvs = document.getElementById('leftcanvas');

// Wire up Doubleclicks
rcvs.addEventListener('CELLDOUBLECLICKED', HandleRightGridDoubleClick, true);
lcvs.addEventListener('CELLDOUBLECLICKED', HandleLeftGridDoubleClick, true);


var lp = document.getElementById('lpath');
var rp = document.getElementById('rpath');

lp.addEventListener('keydown',lpathkeyhandler);
rp.addEventListener('keydown',rpathkeyhandler);

var RDG = new LCTDataGrid(rcvs);
var LDG = new LCTDataGrid(lcvs);

RDG.FillCanvas();
LDG.FillCanvas();

