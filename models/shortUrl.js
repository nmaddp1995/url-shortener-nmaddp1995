const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const urlSchema = new Schema({
    url : String ,
    urlShorten : String
    
});

/*global class*/ const modelClass= mongoose.model("shortUrl",urlSchema);
module.exports = modelClass;