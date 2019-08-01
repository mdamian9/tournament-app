const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Player = require('../models/player');

router.get('/', (req, res, next) => {
    Player.find().select('_id name points').then(players => {
        if (!players) {
            return res.status(404).json({
                message: 'No players found'
            });
        };
        res.status(200).json({
            count: players.length,
            players: players
        });
    }).catch(err => {
        res.status(500).json({
            error: err
        });
    });
});

router.post('/', (req, res, next) => {
    const newPlayer = new Player({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name
    });
    newPlayer.save().then(player => {
        res.status(201).json({
            message: 'Successfully added new player',
            player: player
        });
    }).catch(err => {
        res.status(500).json({
            error: err
        });
    });
});

router.patch('/:name', (req, res, next) => {
    Player.updateOne({ name: req.params.name }, { $set: { points: req.body.points } }).then(result => {
        console.log(result);
        res.status(200).json({
            message: 'Successfully updated user points',
            result: result
        });
    }).catch(err => {
        res.status(500).json({
            error: err
        });
    });
});

router.delete('/', (req, res, next) => {
    Player.deleteMany({}).then(result => {
        res.status(200).json({
            message: 'Successfully deleted all players in db',
            result: result
        });
    }).catch(err => {
        res.status(500).json({
            error: err
        });
    });
});

module.exports = router;
