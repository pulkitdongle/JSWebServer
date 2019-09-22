module.exports={
process:function(file,request,response){
try
{
var resourceToProcess=require("./"+file);
if(typeof(resourceToProcess)=="object")
{
if(!resourceToProcess.process)
{
response.writeHead(500,{"content-type":"text/html"});
response.write("<html><head><title>TM Node Web Server Error Report</title><br><br><h1>Internal server error</h1>Unable to process this request as process method is missing in <b>"+file+"</b> are incorrect</body></html>");
response.end();
return;
}
request.checkSessionTimeoutInterval(request,response);
resourceToProcess.process(request,response);
setTimeout(function(){
request.initiateSessionTimeout();
response.end();
},2000);
}else if(typeof(resourceToProcess)=="function")
{
request.checkSessionTimeoutInterval(request,response);
resourceToProcess(request,response);

setTimeout(function(){
request.initiateSessionTimeout();
response.end();
},2000);

} else
{
response.writeHead(500,{"content-type":"text/html"});
response.write("<html><head><title>TM Node Web Server Error Report</title><br><br><h1>Internal server error</h1>Unable to process this request as the contents of <b>"+file+"</b> are incorrect</body></html>");
response.end();
}
}catch(e)
{
response.writeHead(200,{"content-type":"text/plain"});
response.write(e.stack);
response.end();
}
}
};