const mongoose = require('mongoose')

const FileSchema=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    domains:{
        type:Array,
        required:true
    },
    
},{
    timestamps:true
})

const File=mongoose.model("Files",FileSchema)

module.exports=File
