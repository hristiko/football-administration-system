const express = require('express');
require('dotenv').config();
const path = require('path');
const cors = require('cors')
const app = express();
const port = process.env.PORT || 1234;



const session = require('express-session');

app.set('trust proxy', 1);
app.use(session({
    secret: 'some secret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
}))

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({
   origin: [
    'http://localhost:5432',
    'http://88.200.63.148:5432',
  ],
   methods: ['POST', 'PUT', 'DELETE', 'GET', 'OPTIONS', 'HEAD'],
   credentials: true
}));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.use('/team', require('./routes/team'));
app.use('/fixture', require('./routes/fixture'));
app.use('/lineup', require('./routes/lineup'));
app.use('/result', require('./routes/result'));
app.use('/transfer', require('./routes/transfer'));
app.use('/fine', require('./routes/fine'));
app.use('/auth',     require('./routes/auth'));
app.use('/player',  require('./routes/player'));
app.use('/complaint', require('./routes/complaint'));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));