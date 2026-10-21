const express = require('express');
const result = express.Router();
const db = require('../db/dbConn');

result.post('/', async (req, res) => {
    const { fixture_id, home, away, scorers, mistakes } = req.body;
    try {
        await db.saveResult(fixture_id, home, away, scorers, mistakes);
        res.sendStatus(201);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
})

result.post('/:fixture_id', async (req, res) => {
    const { home, away, scorers, mistakes } = req.body;
    try {
        await db.updateResult(req.params.fixture_id, home, away, scorers, mistakes);
        res.sendStatus(200);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
})

result.get('/', async (req, res) => {
    try {
        const { team } = req.query;
        const rows = team
            ? await db.listResultsByTeam(team)
            : await db.listResults();
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});


module.exports = result;