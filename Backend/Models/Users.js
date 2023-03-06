const mongoose = require('mongoose')

const UserSchema=mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    
},{
    timestamps:true
})

const User=mongoose.model("Users",UserSchema)

module.exports=User
