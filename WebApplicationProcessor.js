var mime=require("mime");
var fileSystemUtilities = require('fs');
var pathUtilities=require("path");
var utils=require('./utils.js');
var responseCodes=utils.responseCodes;
var defaultResources=["index.html","index.htm","index.js","index.technology"];
var jsProcessor=require("./jsProcessor.js");
var technologyProcessor=require("./technologyProcessor.js");
var serverSideExtensions={js: jsProcessor,technology: technologyProcessor};
function WebApplication(contextName,folderName)
{
if(contextName)
{
this.contextName=contextName;
this.folderName=folderName;
}
else
{
this.contextName="/";
this.folderName=null;
}
var publicPath=this.folderName+"\\public\\";
var privatePath=this.folderName+"\\private\\";
/*var resources=[
{uri : "/", file: "default.html", mimeType: "text/html"},
{uri : "/favicon.ico", file: "images\\favicon.png"}
];*/
var resourceCache=[];
var object=this;
function getResource(uri)
{
if(uri.length==0) uri="/";
if(uri=="/")
{
if(object.configuration.homePage)
{
return {
responseCode: responseCodes.redirect,
redirectTo: object.configuration.homePage
};
}
var defaultResource=object.configuration.resources.find(function(e){if(e.uri=="/") return true;});
if(defaultResource)
{
return {
responseCode: responseCodes.redirect,
redirectTo: defaultResource.file
};
}
var defaultResource=defaultResources.find(function(e){
return utils.isFile(publicPath+e);
});
if(defaultResource)
{
object.configuration.homePage=defaultResource;
return {
responseCode: responseCodes.redirect,
redirectTo: defaultResource
};
}
return {
responseCode: responseCodes.notFound,
};
}
console.log("Context name : "+object.contextName);
console.log("URI : ",uri);
var resource;
resource=resourceCache.find(function(e){return e.uri==uri;});
if(resource) return resource;
resource=object.configuration.resources.find(function(e){return e.uri==uri;});
if(resource)
{
if(resource.file.substring(0,1)=='/') resource.file=resource.file.substring(1);
if(resource.file.length==0)
{
resource={};
resource.responseCode=responseCodes.notFound;
resourceCache.push(resource);
return resource;
}
var resourceExists=false;
if(utils.isFile(privatePath+resource.file))
{
resource.file=privatePath+resource.file;
resourceExists=true;
}
else if(utils.isFile(publicPath+resource.file))
{
resource.file=publicPath+resource.file;
resourceExists=true;
}
if(!resourceExists)
{
resource={};
resource.responseCode=responseCodes.notFound;
resourceCache.push(resource);
return resource;
}
resource.responseCode=responseCodes.ok;
if(!resource.mimeType)
{
resource.mimeType=mime.lookup(resource.file);
}
}
else
{
var relativePath=pathUtilities.join(publicPath,uri.substring(1));
console.log(relativePath);
var absolutePath=pathUtilities.join(process.cwd(),pathUtilities.join(publicPath,uri.substring(1)));
console.log(absolutePath);
try 
{
console.log("Looking for : "+absolutePath);
stats=fileSystemUtilities.lstatSync(absolutePath);
if(stats.isFile())
{
resource={};
resource.uri=uri;
resource.file=publicPath+uri.substring(1);
resource.responseCode=responseCodes.ok;
resource.mimeType=mime.lookup(absolutePath);
object.configuration.resources.push(resource);
}
else
{
resource={};
resource.responseCode=responseCodes.notFound;
}
}catch (e) 
{
resource={};
resource.responseCode=responseCodes.notFound;
}
} 
resourceCache.push(resource);
return resource;
}
this.process=function(request,response)
{
if(!folderName)
{
response.writeHead(500,{"content-type":"text/html"});
response.write("<html><head><title>TM Node Web Server Error Report</title><br><br><h1>HTTP Status 500 - No Context configured to process this request</h1></body></html>");
response.end();
return;
}
request.resource=request.requestURI.substring(this.contextName.length);
var resourceJSON=getResource(request.resource);
if(resourceJSON.responseCode==responseCodes.redirect)
{
response.writeHead(302,{Location: this.contextName+"/"+resourceJSON.redirectTo});
response.end();
return;
}
if(resourceJSON.responseCode==responseCodes.notFound)
{
response.writeHead(responseCodes.notFound,{"content-type":"text/html"});
response.write("<html><head><title>cool foolTM Node Web Server/1.0 - Error report</title><STYLE><!--H1{font-family : sans-serif,Arial,Tahoma;color : white;background-color : #0086b2;} BODY{font-family : sans-serif,Arial,Tahoma;color : black;background-color : white;} B{color : white;background-color : #0086b2;} HR{color : #0086b2;} --></STYLE> </head><body><h1>TM Node Web Server/1.0 - HTTP Status 404 - "+request.resource+"</h1><HR size='1' noshade><p><b>type</b> Status report</p><p><b>message</b> <u>"+request.resource+"</u></p><p><b>description</b> <u>The requested resource ("+request.resource+") is not available.</u></p><HR size='1' noshade></body></html>");
response.end();
return;
}
if(resourceJSON.responseCode==responseCodes.ok)
{
var serverSideTechnologyProcessor=serverSideExtensions[pathUtilities.extname(resourceJSON.file).substring(1)];

// for client side js files
if(pathUtilities.extname(resourceJSON.file).indexOf("client")!=-1)
{
fileSystemUtilities.createReadStream(resourceJSON.file).pipe(response);
return;
}
if(serverSideTechnologyProcessor)
{
serverSideTechnologyProcessor.process(resourceJSON.file,request,response);
response.end();
return;
}
response.writeHead(200,{"content-type": resourceJSON.mimeType });
console.log('resource file : '+resourceJSON.file);
fileSystemUtilities.createReadStream(resourceJSON.file).pipe(response);
}
}
}
module.exports={
createWebApplication:function(contextName,folderName)
{
return new WebApplication(contextName,folderName);
},
createRootWebApplication:function()
{
return new WebApplication();
}
};
