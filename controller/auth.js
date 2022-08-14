const jwt = require('jsonwebtoken')

const User = require('../models/User');

exports.register = async (req,res,next) =>{
    const{username,email,password} = req.body;
    console.log(req.body)
    try{
        const user = await User.create({
            username,
            email,
            password
        });
        res.status(200).json({
            succes : 'true',
            message: 'Successfully registered',
        })
       
    }
    catch(error){
        res.status(500).json({
            success: 'true',
            message: error.message
        });
    }
  
    next();
}

exports.login = async(req,res,next)  => {
    
    const{email, password} = req.body;

    if(!email || !password) res.status(401).json({
        succes: 'false',
        message: "Please enter both email and password"
    });
    try{
        const user = await User.findOne({email}).select('+password');
        if(!user) res.status(404).json({
            succes: 'false',
            error: "Invalid credential"
        });
        
        const isMatched = user.matchPassword(password);
        if(!isMatched) res.status(401).json({
            success: 'false',
            error: "password did not matched"
        });
        sendToken(user,200,res);
        
    }catch(error){
        res.status(500).json({
            succes: 'false',
            error: error.message,
        })
    }
    next();
}

exports.payment = (req,res,next) =>{
    res.send(`Welcom ${req.username}, you can pay `);
    next();
}

exports.genToken = async (req,res,next) =>{
    const refreshToken = req.header('x-auth-token');

    if(!refreshToken){
        return res.status(401).json({
            success : "false",
            message : "No token found"
        });
    }
    try{
        const user = await jwt.verify(refreshToken,process.env.JWT_REFRESH_KEY);
        const id = user.id;
        const accesToken = await jwt.sign({id},process.env.JWT_SECRET_KEY,{
            expiresIn : process.env.JWT_EXPIRES_IN,
        })

        res.status(200).json({
            success: 'true',
            access_token : accesToken,
        })
    }
    catch(err){
        return res.status(500).json({
            succes: 'false',
            message: 'Invalid token',
        })
    }
    next();
}

// sending jwt token
const sendToken = (user,statusCode,res) =>{
    token = user.getSignedToken();
    refreshToken = user.getRefreshToken();
    res.status(statusCode).json({
        succes: "true",
        username: user.username,
        access_token: token,
        refresh_token: refreshToken,
    })
}