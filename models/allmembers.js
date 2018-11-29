var mongoose=require("mongoose");
var allmembersSchema= new mongoose.Schema({
    message:{type:String,required:true},
    date:{ type: Date, default: Date.now }
});
module.exports=mongoose.model("Allmembers",allmembersSchema);