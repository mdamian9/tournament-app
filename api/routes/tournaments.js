const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Tournament = require('../models/tournament');

router.get('/', (req, res, next) => {
    Tournament.find().select('_id inProgress').then(tournaments => {
        res.status(200).json({
            message: 'GET /tournaments',
            count: tournaments.length,
            tournaments: tournaments
        });    
    }).catch(err => {
        res.status(500).json({
            error: err
        });
    });
});

router.post('/', (req, res, next) => {
    newTournament = new Tournament({
        _id: new mongoose.Types.ObjectId(),
        inProgress: req.body.inProgress
    });
    newTournament.save().then(result => {
        res.status(201).json({
            message: 'Successfully created / started tournament - round',
            result: result
        });
    }).catch(err => {
        res.status(500).json({
            error: err
        });
    });
});

module.exports = router;
