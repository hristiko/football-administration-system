const express = require('express');
const auth = express.Router();
const db = require('../db/dbConn');

auth.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const rows = await db.getUserByUsername(username);
        if (rows.length === 0) {
            return res.status(401).json({ msg: 'User not found' });
        }

        const user = rows[0];
        if (user.password !== password) {
            return res.status(401).json({ msg: 'Invalid credentials' });
        }
        req.session.user = {
            id: user.id,
            username: user.username,
            role: user.role,
            team_id: user.team_id
        };

        return res.sendStatus(200);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});

auth.get('/me', (req, res) => {
  if (req.session.user) return res.json(req.session.user);
  res.sendStatus(401);
});


module.exports = auth;