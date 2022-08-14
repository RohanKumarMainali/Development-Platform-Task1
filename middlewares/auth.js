const jwt = require('jsonwebtoken');
const User = require('../models/User')

const verifyToken = async(req,res,next) =>{
    const token = req.body.token;

    if(!token) return res.send("token is required, you cannot pay")

    try{
        const decoded =  jwt.verify(token,process.env.JWT_SECRET_KEY);
        req.user = decoded;
        const user = await  User.findById(req.user.id);
        req.username = user.username;

    }catch(err){
        return res.status(401).json({
            success: "false",
            message: "Invalid Token, you cannot pay"
        });
    }
     next();
}

module.exports = verifyToken;