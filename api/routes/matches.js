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
    // Match.find({ pOne: req.body.pOne, pTwo: req.body.pTwo }).then(result => {
    //     console.log(result.length);
    //     if (result.length < 1) {
    //         console.log('Should send 409');
    //         return res.status(409).json({
    //             message: 'Match already exists'
    //         });
    //     };
    const newMatch = new Match({
        _id: new mongoose.Types.ObjectId(),
        pOne: req.body.pOne,
        pTwo: req.body.pTwo
    });
    newMatch.save().then(match => {
        res.status(201).json({
            message: 'Successfully created new match',
            match: match,
            players: `${match.pOne} vs. ${match.pTwo}`
        });
    });
    // }).catch(err => {
    //     res.status(500).json({
    //         err: err
    //     });
    // });
});

router.delete('/:matchId', (req, res, next) => {
    Match.deleteOne({ _id: req.params.matchId }).then(result => {
        console.log(result);
        res.status(200).json({
            message: 'Match is over - match successfully deleted',
            result: result
        });
    }).catch(err => {
        res.status(500).json({
            error: err
        });
    });
});

module.exports = router;
