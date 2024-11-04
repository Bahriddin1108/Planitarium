const express=require('express')
const connectDB=require('./config/db')
const dotenv=require('dotenv')
const colors=require('colors')
const cors=require('cors')
const path=require('path')
const morgan=require('morgan')
const errorHandler = require('./middlewares/error')
  
//initialize env variables
dotenv.config()


connectDB()

//App instance 
const app=express()

//Body parser
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(cors())


if(process.env.NODE_ENV==='development'){
    app.use(morgan('dev'))
} 

//Set static folder

app.use(express.static(path.join(__dirname, 'public' ))) 

app.use('/api/v1/auth',require('./routes/auth.route')) 
app.use('/api/v1/stars',require('./routes/star.route')) 
app.use('/api/v1/planets',require('./routes/planet.route')) 

app.use(errorHandler)
const PORT=process.env.PORT||7000

app.listen(PORT,()=>{
    console.log(`Server running in ${process.env.NODE_ENV} mode on ${PORT}`.white.bold)
})