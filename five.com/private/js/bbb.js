module.exports=function(request,response)
{
var nn=request.getCookie("nm");
var ss=request.getCookie("sex");
var cc=request.getCookie("ct");
console.log("Request arrived");
console.log("Data arrived");
console.log("Name : "+nn);
console.log("Gender : "+ss);
console.log("City : "+cc);

console.log("----------------------------for session---------------");
//console.log("city :"+request.sessionObject["city"]);
console.log("----------------------------end session---------------");

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
response.write("<h2>"+request.sessionObject['name']+"</h2>");
response.write("<h4><u>Using Cookies</u></h4>");
response.write("<h1>Data Saved</h1></body></html>");
response.write("Name : "+nn+"</br>");
response.write("Gender : "+ss+"</br>");
response.write("City : "+cc+"</br>");
response.write("</center>");
};