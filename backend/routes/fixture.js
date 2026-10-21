const express = require('express');
const fixture = express.Router();
const db = require('../db/dbConn');

fixture.post('/', async (req, res) => {
    const {home_team, away_team, match_date, stadium} = req.body;
    try {
        await db.createFixture( home_team, away_team, match_date, stadium );
        res.sendStatus(201);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
})

fixture.post('/:id', async (req, res) => {
    const {home_team, away_team, match_date, stadium} = req.body;
    try{
        await db.updateFixture(req.params.id, home_team, away_team, match_date, stadium);
        res.sendStatus(200);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
})

fixture.get('/', async (req, res) => {
    try{

        const {team_id} = req.query;
        let sol;

        if (team_id){
            sol = await db.listFixturesByTeam(team_id);
        } else {
            sol = await db.listFixtures();
        }
        res.json(sol);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
})

module.exports = fixture;


