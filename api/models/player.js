const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    pOne: {
        type: String,
        required: true,
        trim: true
    },
    pTwo: {
        type: String
    }
});

module.exports = mongoose.model('Player', playerSchema);
