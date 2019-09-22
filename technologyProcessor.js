module.exports={
process:function(file,request,response){
console.log("technologyProcessor invoked for : "+file);
response.writeHead(200,{"content-type":"text/html"});
response.end();
}
};