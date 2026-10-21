const express = require('express');
const transfer = express.Router();
const multer = require('multer');
const upload = multer({dest: 'uploads/'});
const db = require('../db/dbConn');

transfer.post('/', upload.single('file'), async (req, res) => {
    const {player_id, from_team_id, to_team_id, user_id} = req.body;
    try{
        await db.createTransfer(player_id, from_team_id, to_team_id, user_id);
        res.sendStatus(201);
    } catch(err){
        console.error(err);
        res.sendStatus(500);
    }
})

transfer.post('/:id/approve', async (req,res) => {
    try{
        await db.approveTransfer(req.params.id);
        res.sendStatus(200);
    } catch(err){
        console.error(err);
        res.sendStatus(500);
    }
})

transfer.delete('/:id', async (req,res) => {
    try{
        await db.rejectTransfer(req.params.id);
        res.sendStatus(200);
    } catch(err){
        console.error(err);
        res.sendStatus(500);
    }
})

transfer.get('/pending', async (req,res) => {
    try{
        const rows = await db.listPendingTransfers();
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
})

transfer.get('/my', async (req, res) => {
    try {
        const rows = await db.listTransfersByUser(req.session.user.id);
        res.json(rows);
    } catch (e) { console.error(e); res.sendStatus(500); }
});

module.exports = transfer;
