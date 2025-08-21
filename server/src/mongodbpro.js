const mongoose = require('mongoose')
mongoose.connect("mongodb://0.0.0.0/Backend ")
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