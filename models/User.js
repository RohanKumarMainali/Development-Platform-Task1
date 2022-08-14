const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    
    username:{
        type: String,
        required: [true,"Please enter your username"]
    },

    email: {
        type: String,
        requried: [true,"Email is required"]
    },

    password: {
        type: String,
        requried: [true,"Password is required"]
    }
})

// encrypting and saving password as a hash
UserSchema.pre('save',async function(next){

    if(!this.isModified("password")) next();

    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password,salt);
    next();
})

// comparing hashed password

UserSchema.methods.matchPassword = async function(password){
    return await bcrypt.compare(this.password,password);
}

UserSchema.methods.getSignedToken = function(){
    return jwt.sign({id: this._id}, process.env.JWT_SECRET_KEY,{
        expiresIn : process.env.JWT_EXPIRES_IN
    });
}

UserSchema.methods.getRefreshToken = function(){
    return jwt.sign({id: this._id}, process.env.JWT_REFRESH_KEY,{
        expiresIn : '1y'
    });
}

const User = mongoose.model('User',UserSchema);

module.exports = User;