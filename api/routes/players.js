const express = require('express');
const router = express.Router();

const Player = require('../models/player');

router.get('/', (req, res, next) => {
    Player.find().then(players => {
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

module.exports = router;
