const mongoose = require("mongoose")
const passportLocalMongoose = require("passport-local-mongoose")

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:false,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true
    },
    otp: {
        type:String,
    },
    otpExpire: {
        type:Date,
    },
    isVerified:{
        type:Boolean,
        default:false,
    }
},{ timestamps: true });

userSchema.plugin(passportLocalMongoose,{usernameField:"email"});

module.exports = mongoose.model("User",userSchema);
