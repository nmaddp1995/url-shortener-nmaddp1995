var express= require("express");
var app = express();
var port = process.env.PORT || 8080;
var MongoClient = require("mongodb").MongoClient;
var mongoose = require("mongoose");
var shortUrl = require("./models/shortUrl");

// const Schema = mongoose.Schema;
// const urlSchema = new Schema({
//     url : String ,
//     urlShorten : String
    
// });

// const modelClass= mongoose.model("shortUrl",urlSchema);
//Connect to db :

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/shortUrls');
mongoose.Promise = global.Promise;


// shortUrl.remove({}, function(){}); 
app.get('/',function(req,res){
	res.sendfile('index.html', {root: __dirname });
});

app.get("/new/:value",function(req,res){
    var value = req.params.value;
    console.log(value);
    var expression = /[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
    var reg = new RegExp(expression);
    
    if(reg.test(value)===true){
        var urlShorten ;
        shortUrl.count({}, function( err, count){
            if(err) throw err ;
            urlShorten = count+1 ;
            var data = new shortUrl({
            url : value,
            urlShorten : urlShorten
        });
        data.save(err=>{
            if(err){
                return res.send("Something Error");
            }
            
        });
        var dataShow ={
            originalUrl : data.url,
            shortenerUrl : data.urlShorten
        }
        res.json(dataShow);
        
            
        })
        
        
        
    } else {
        return res.send("URL wrong");
    }
    
    
});

app.get('/:urlShorten',function(req,res){
    var urlShorten = req.params.urlShorten;
    var isnum = /^\d+$/.test(urlShorten);
    if(isnum){
    shortUrl.findOne({
        'urlShorten': urlShorten},
        function(err,data){
            if(err) return res.send("Something error");
            if(data==null) return res.send("No information");
            
            return res.redirect(301,"http://"+data.url);
        }
    )
    }
    else {
        res.send("Please pass a number");
    }
})

app.get("/check/allData",function(req,res){
   shortUrl.find({},function(err,data){
       res.json(data);
   }) 
});

app.listen(port,function(){
	console.log("Server is running");
})