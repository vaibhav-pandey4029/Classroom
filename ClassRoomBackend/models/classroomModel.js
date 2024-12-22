const mongoose = require('mongoose');

const ClassroomSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    description:{
        type:String,
        trim:true,
    },
    students:[{
        type:mongoose.Types.ObjectId,
        ref:'User'
    }]
},{timestamps:true})