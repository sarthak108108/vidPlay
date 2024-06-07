// require('dotenv').config({path: './env'})
import dotenv from "dotenv"

import express from "express"
const app = express()

import connectDB from "./db/index.js";

dotenv.config({
    path: './env'
})



connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server is running at port : ${process.env.PORT}`)
    })
})
.catch((err) => {
    console.log('connection failed !!!');
})
















// function connect_DB(){}

// connect_DB()



/*
( async () => {
    try{
        await mongoose.connect(`${process.env.MONGODB_URL}/${DB_name}`)
        app.on("error", )
        
        app.listen(process.env.PORT, () => {
            console.log(`App is listening on port: ${process.env.PORT}`)
        })

    } 
    
    
    
    catch (error){
        console.error("ERROR", (error) => {
            console.log("ERRR:", error);
            throw error
        })
        throw error
    }
})()

*/