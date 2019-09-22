module.exports=function(request,response)
{
response.writeHead(200,{"conent-type":"text/html"});
var nn=request.queryStringParameters["nm"];
var cc=request.queryStringParameters["ct"];
var ss=request.queryStringParameters["sex"];
console.log("Name : "+nn);
console.log("City : "+cc);
console.log("Gender : "+ss);
response.write("<!Doctype html>");
response.write("<html lang='en'>");
response.write("<head>");
response.write("<meta charset='utf-8'>");
response.write("<title>one.com</title>");
response.write("</head>");
response.write("<body>");
response.write("<h1>Data Saved</h1></body></html>");
}