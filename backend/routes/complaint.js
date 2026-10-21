const express = require('express');
const complaint = express.Router();
const db = require('../db/dbConn');

complaint.post('/', async (req, res) => {
    const { team_id, fixture_id, message } = req.body;
    if (!team_id || !fixture_id || !message)
        return res.status(400).json({ ok: false, msg: 'Missing fields' });

    try {
        await db.createComplaint(team_id, fixture_id, message);
        res.sendStatus(201);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});

complaint.get('/', async (_req, res) => {
    try {
        res.json(await db.listComplaints());
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});

module.exports = complaint;