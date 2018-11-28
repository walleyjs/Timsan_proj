var mongoose=require("mongoose");
var todoSchema= new mongoose.Schema({
    hobby:{type:String,required:true},
    date:{ type: Date, default: Date.now }
});
module.exports=mongoose.model("Todo",todoSchema);