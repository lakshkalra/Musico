const mongoose = require('mongoose')
const config = require('config')
const DB_URL = config.get("mongoURI")

const connectDB = async () => {
    try {
        await mongoose.connect(DB_URL,{
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
        });
        console.log('connect to DB....')
    } catch (err) {
        console.log(err)
        process.exit(1)
    }
}

module.exports = connectDB