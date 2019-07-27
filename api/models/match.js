const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    pOne: {
        type: String,
        required: true,
        trim: true
    },
    pTwo: {
        type: String,
        required: true,
        trim: true
    }
});

module.exports = mongoose.model('Match', matchSchema);
