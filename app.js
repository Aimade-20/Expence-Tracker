const express = require('express')

const connectDB = require('./Config/db')
const app = express()

connectDB()
app.use(express.json())
app.listen(3000 , () => 
    console.log('server is running on port 3000'))