const mongoose = require('mongoose')

const mongoDB =  async () =>{
    try{
        await mongoose.connect(process.env.MONGO_URI)
       
    }catch(err){
        console.log(err);
    }
    console.log("Database connected")
}

module.exports = mongoDB;