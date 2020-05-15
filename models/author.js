const mongoose = require('mongoose')

const authorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
})


//exports mongoose model with scheme "Author"
module.exports = mongoose.model('Author', authorSchema)