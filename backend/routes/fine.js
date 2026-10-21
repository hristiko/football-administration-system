const express = require('express');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const fine = express.Router();
const db = require('../db/dbConn');

fine.post('/', upload.single('file'), async (req, res) => {
    const {team_id, reason, amount} = req.body;
    try{
        await db.issueFine(team_id, reason, amount);
        res.sendStatus(201);
    } catch(err) {      
        console.error(err);
        res.sendStatus(500);
    }
})

fine.post('/:id/pay', async (req,res) => {
    try{
        await db.payFine(req.params.id);
        res.sendStatus(200);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
})

fine.get('/', async (req, res) => {
    try{
        res.json(
            await db.listFines(req.query.team_id)
        );
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
})

module.exports = fine;
