const { Schema,model }= require("mongoose")

const TemplateSchema = new Schema({
  name:{
    required:true,
    type:String
  },
  value:{
    type:String
  }
},{
  timestamps:true
});

module.exports=model("Template",TemplateSchema)
