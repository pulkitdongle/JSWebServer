var fs=require("fs");
var path=require("path");
module.exports={
responseCodes: {
ok: 200,
redirect:302,
badRequest: 400,
notAuthorized: 401,
forbidden: 403,
notFound: 404,
internalServerError:500
},
createFolderSync:function(folderName)
{
var exists=fs.existsSync(folderName);
if(exists)
{
var stats=fs.lstatSync(folderName);
if(stats.isFile())
{
fs.unlinkSync(folderName);
exists=false;
}
}
if(exists==false)
{
fs.mkdirSync(folderName);
}
},
createFoldersSync: function(folders)
{
var array=folders.split(/[\\/]/);
var folder="";
var object=this;
array.forEach(function(e){
folder+=e;
object.createFolderSync(folder);
folder+="\\";
});
},
getDirectories:function(srcpath) 
{
  return fs.readdirSync(srcpath).filter(function(file) {
    return fs.statSync(path.join(srcpath, file)).isDirectory();
  });
},
isDirectory:function(folderName)
{
if(fs.existsSync(folderName))
{
if(fs.lstatSync(folderName).isDirectory()) return true;
else return false;
} else return false;
},
isFile:function(fileName)
{
if(fs.existsSync(fileName))
{
if(fs.lstatSync(fileName).isFile()) return true;
else return false;
} else return false;
},
getJSONFromFile:function(fileName)
{
var r={};
try
{
r.json=JSON.parse(fs.readFileSync(fileName,"utf-8"));
r.success=true;
}catch(e)
{
r.error=e;
r.success=false;
}
return r;
},
isValidContextName:function(contextName)
{
return true;
}
}
