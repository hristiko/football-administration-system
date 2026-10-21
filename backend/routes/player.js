const express = require('express');
const player = express.Router();
const db = require('../db/dbConn');

player.get('/', async (req, res) => {
    try {
        res.json(await db.listPlayers(req.query.team_id));
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});

module.exports = player;