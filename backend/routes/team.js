const express = require('express');
const team = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const db = require('../db/dbConn');

team.put('/:id', upload.single('logo'), async (req, res) => {
  const { name, stadium_name } = req.body;
  const logo_url = req.file ? `/uploads/${req.file.filename}` : '';

  if (!name || !stadium_name) {
    return res
      .status(400)
      .json({ success: false, msg: 'Missing fields' });
  }

  try {
    await db.updateTeam(req.params.id, name, logo_url, stadium_name);
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

team.get('/:id', async (req, res) => {
  const rows = await db.getTeam(req.params.id);
  if (rows.length > 0) return res.json(rows[0]);   // ok
  res.status(404).json({ msg: 'Team does not exist' });
});

team.get('/', async (req, res) => {
  try {
    const { status } = req.query;

    if (status === 'pending') {
      return res.json(await db.getPendingTeams());
    }
    if (status === 'rejected') {
      return res.json(await db.listRejectedTeams());
    }

    res.json(await db.listAllTeams());
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

team.post('/:id/approve', async (req, res) => {
  try {
    await db.approveTeam(req.params.id);
    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});



team.post('/:id/reject', async (req, res) => {
  try {

    await db.rejectTeam(req.params.id);
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

module.exports = team;