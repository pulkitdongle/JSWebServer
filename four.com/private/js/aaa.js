module.exports=function(request,response)
{
var nn=request.queryStringParameters["nm"];
var ss=request.queryStringParameters["sex"];
var cc=request.queryStringParameters["ct"];
console.log("Request arrived");
console.log("Data arrived");
console.log("Name : "+nn);
console.log("Gender : "+ss);
console.log("City : "+cc);
response.addCookie("nm",nn);
response.addCookie("sex",ss);
response.addCookie("ct",cc,24*60*60);

request.sessionObject["name"]=nn;
request.sessionObject.setSessionTimeout(1);

response.setContentType("text/html");
response.write("<!Doctype html>");
response.write("<html lang='en'>");
response.write("<head>");
response.write("<meta charset='utf-8'>");
response.write("<title>three.com</title>");
response.write("</head>");
response.write("<body>");
response.write("<center>");
response.write("<h1>Session Tracking Example</h1>");
response.write("<h4><u>Using Cookies</u></h4>");
response.write("<a href='/four.com/SaveData'>Save</a>");
response.write("</center>");
response.write("</body>");
response.write("</html>");
};