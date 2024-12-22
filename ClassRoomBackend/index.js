const express=  require('express')
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('./db')

const port = process.env.PORT

const dotenv = require('dotenv')
dotenv.config();


// given frontend url will be allowed to access the backend
const allowedOrigins = [process.env.FRONTEND_URL]

// allow cors which will check if frontend url is genuiune or not
//origin that means the url
//credentials means cookies we need to check credentials
// allowedOrigins.includes(origin) if origin matches with allowedOrigins then I am allowed to access my backend otherwise CORS error will be thrown
app.use(cors({
    origin:function(origin,callback){
        console.log("origin ",allowedOrigins,origin,allowedOrigins.includes(origin));
        if(!origin||allowedOrigins.includes(origin)){
            callback(null,true);
        }else{
            callback(new Error("Not allowed by CORS"))
        }
    },
    credentials:true
}))

// Handle preflight requests
app.options('*', cors({
    origin: allowedOrigins[0],
    credentials: true,
}));

// app will be able to read json things
app.use(bodyParser.json());

app.use(cookieParser({
    httpOnly:true,
    secure:true,
    sameSite:'none',
    maxAge:1000*60*60*24*7,
    signed:true
}))


const authRoutes=  require('./routes/authRoutes')
// const classroomRoutes = require('./routes/classroomRoutes')

app.use('/auth',authRoutes)
// app.use('/class',classroomRoutes)


app.get('/',(req,res)=>{
    res.send("Hello this is classroom");
})

app.get('/getuserdata',(req,res)=>{
    res.send("vaibhav pandey, 24, Male")
})

app.listen(port ,()=>{
    console.log(`listening in port ${port}`)
})