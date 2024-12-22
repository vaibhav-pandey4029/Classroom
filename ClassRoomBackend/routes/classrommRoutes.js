const express = require('express');
const responseFunction = require('../utils/responseFunction')
const router = express.Router();
const authTokenHandler = require('../middlewares/checkAuthToken');
const Classroom = require('../models/classroomModel');
const authTokenHandler = require('../middlewares/checkAuthToken');


//API to create a classroom

//more security to be added teacher can only create classroom
router.post('/create',authTokenHandler,async (req,res,)=>{
    const {name,description} = req.body;
    if(!name){
        return responseFunction(res,400,'Classroom name is required',null,false);
    }
    try{
        const newClassroom = new Classroom({
            name,
            description,
            owner:req.userId,
        });
        await newClassroom.save();
        return responseFunction(res,201,'Classroom created successfully',newClassroom,true);
    }catch(error){
        return responseFunction(res,500,'Internal Server Error',err,false);
    }
})

router.get('/classroomscreatedbyme',authTokenHandler,async (req,res)=>{
    try{
        const classrooms = await Classroom.find({owner:req.userId});
        return responseFunction(res,200,'Classrooms fetched successfully',classrooms,true);
    }catch(error){
        return responseFunction(res,500,'Internal server error',err,false);
    }
})