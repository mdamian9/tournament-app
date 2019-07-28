const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Match = require('../models/match');

router.get('/', (req, res, next) => {
    Match.find().select('_id pOne pTwo').then(matches => {
        if (!matches) {
            return res.status(404).json({
                message: 'No matches found'
            });
        };
        res.status(200).json({
            count: matches.length,
            matches: matches
        });
    });
});

router.post('/', (req, res, next) => {
    // const newMatch = new Match({
    //     _id: new mongoose.Types.ObjectId(),
    //     pOne: req.body.pOne,
    //     pTwo: req.body.pTwo
    // });
    // newMatch.save().then(match => {
    //     res.status(201).json({
    //         message: 'Successfully created new match',
    //         match: match,
    //         players: `${match.pOne} vs. ${match.pTwo}`
    //     });
    // });
    console.log(req.body);
});

module.exports = router;
