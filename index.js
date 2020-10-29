const express = require('express')
const connectDB = require('./config/db')

const PORT = process.env.PORT || 5000
const app = express()

// Database connection
connectDB()

// Middleware
app.use(express.json())

// Route paths
app.use("/", require("./routes/Artist/user"))

app.listen(PORT, () => { console.log(`server on port ${PORT}`) })