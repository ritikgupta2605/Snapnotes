const mongoose = require('mongoose')
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://0.0.0.0/Backend";

mongoose.connect(MONGO_URI)
.then(()=>{
    console.log("mongodb connected");
})

.catch(()=>{
    console.log("failed to connect");
})

const LogInSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    Mobile:{
        type:String,
        required:true
    },

    isVerified: { type: Boolean, default: false },
  otp: String,
})

const collection = new mongoose.model("collection1",LogInSchema)

module.exports=collection