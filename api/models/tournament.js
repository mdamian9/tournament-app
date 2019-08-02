const mongoose = require('mongoose');

const tournamentSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    inProgress: {
        type: Boolean,
        required: true
    }
});

module.exports = mongoose.model('Tournament', tournamentSchema);

