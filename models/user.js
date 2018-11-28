var mongoose=require("mongoose");
// var passportLocalMongoose=require("passport-local-mongoose");
var userSchema=new mongoose.Schema({
    username:{type:String,required:true},
    email:{type:String,required:true},
    password:String,
    number:{type:String,required:true},
    todo:[
        {type:mongoose.Schema.Types.ObjectId,
        ref:"Todo"
        }
    ]
});
// userSchema.plugin(passportLocalMongoose);
module.exports=mongoose.model("User",userSchema);