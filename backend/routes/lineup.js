const express = require('express');
const lineup = express.Router();
const db = require('../db/dbConn');

lineup.post('/', async (req, res) => {
    const { fixture_id, team_id, players } = req.body;
    try {
        for (const p of players)
            await db.insertLineupRow(fixture_id, team_id, p.id, p.starting);
        res.sendStatus(201);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
})

module.exports = lineup;