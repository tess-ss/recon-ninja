const jwt=require('jsonwebtoken')

const generateWebToken=(id)=>{
    const token = jwt.sign({id}, "abcd1234");
    return token
}

module.exports=generateWebToken
