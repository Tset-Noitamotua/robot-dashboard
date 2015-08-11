var http = require('http');


var receiver = http.createServer(function(req,res){

    var postdata = "";
    req.on('data',function(d){ postdata += d; });
    req.on('end',function(){
        if(postdata){
            console.log(postdata)
        }
    });

    res.end();

}).listen(2688, '0.0.0.0');
