const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        required: true,
        trim: true
    },
    points: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('Player', playerSchema);
