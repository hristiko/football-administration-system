const mysql = require('mysql2');

const conn = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_DATABASE,
})

conn.connect((err) => {
  if (err) {
    console.log("ERROR: " + err.message);
    return;
  }
  console.log('Connection established');
})


let dataPool = {}

/*--------RESOLVING DATABASE FOR TEAM-----------*/
dataPool.updateTeam = (id, name, logo_url, stadium_name) => {
  return new Promise((resolve, reject) => {
    conn.query('UPDATE Team SET name=?, logo_url=?, stadium_name=?, compliance_status = 0 WHERE id = ?', [name, logo_url, stadium_name, id], (err, res) => {
      if (err) return reject(err);
      return resolve(res);
    })
  })
}

dataPool.getPendingTeams = () => {
  return new Promise((resolve, reject) => {
    conn.query('SELECT * FROM Team WHERE compliance_status=0', (err, res) => {
      if (err) return reject(err);
      return resolve(res);
    })
  })
}

dataPool.approveTeam = id => {
  return new Promise((resolve, reject) => {
    conn.query('UPDATE Team SET compliance_status=1 WHERE id=?', [id], (err, res) => {
      if (err) return reject(err);
      return resolve(res);
    })
  })
}

dataPool.getTeam = id => {
  return new Promise((resolve, reject) => {
    conn.query('SELECT * FROM Team WHERE id = ?', [id], (err, res) => {
      if (err) return reject(err);
      return resolve(res);
    })
  })
}

dataPool.listAllTeams = () => {
  return new Promise((resolve, reject) => {
    conn.query('SELECT id, name FROM Team', (err, res) => {
      if (err) return reject(err);
      resolve(res);
    })
  })
}

dataPool.rejectTeam = (id) => {
  return new Promise((resolve, reject) => {
    conn.query('UPDATE Team SET compliance_status = -1 WHERE id = ?', [id], (err, res) => {
      if (err) return reject(err);
      resolve(res);
    }
    );
  });
};

dataPool.listRejectedTeams = () => {
  return new Promise((resolve, reject) => {
    conn.query(
      'SELECT * FROM Team WHERE compliance_status = -1',   // -1 = rejected
      (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      }
    );
  });
};

/*--------RESOLVING DATABASE FOR FIXTURE---------------*/
dataPool.createFixture = (home_team, away_team, match_date, stadium) => {
  return new Promise((resolve, reject) => {
    conn.query('INSERT INTO Fixture (home_team_id,away_team_id,match_date,stadium) VALUES (?,?,?,?)', [home_team, away_team, match_date, stadium], (err, res) => {
      if (err) return reject(err);
      return resolve(res);
    }
    );
  });
};

dataPool.updateFixture = (id, home_team, away_team, match_date, stadium) => {
  return new Promise((resolve, reject) => {
    conn.query('UPDATE Fixture SET home_team_id=?,away_team_id=?,match_date=?,stadium=? WHERE id=?', [home_team, away_team, match_date, stadium, id], (err, res) => {
      if (err) return reject(err);
      return resolve(res);
    })
  })
}

dataPool.listFixtures = () => {
  return new Promise((resolve, reject) => {
    conn.query('SELECT * FROM Fixture', (err, res) => {
      if (err) return reject(err);
      return resolve(res);
    })
  })
}

dataPool.listFixturesByTeam = team_id => {
  return new Promise((resolve, reject) => {
    conn.query('SELECT * FROM Fixture WHERE home_team_id = ? OR away_team_id = ?', [team_id, team_id], (err, res) => {
      if (err) return reject(err);
      return resolve(res);
    })
  })
}

/*-----RESOLVING DATABASE FOR LINE-UP------*/
dataPool.insertLineupRow = (fixture, team, player, isStart) => {
  return new Promise((resolve, reject) => {
    conn.query('INSERT INTO Lineup (fixture_id, team_id, player_id, is_starting) VALUES (?,?,?,?)', [fixture, team, player, isStart], (err, res) => {
      if (err) return reject(err);
      return resolve(res);
    })
  })
}

/*----RESOLVING DATABASE FOR RESULT-------*/
dataPool.saveResult = (fixture_id, home, away, scorers, mistakes) => {
  return new Promise((resolve, reject) => {
    conn.query('INSERT INTO Result (fixture_id, home_score, away_score, goal_scorers, referee_mistakes) VALUES (?,?,?,?,?)', [fixture_id, home, away, scorers, mistakes], (err, res) => {
      if (err) return reject(err);
      return resolve(res);
    })
  })
}

dataPool.updateResult = (fixture_id, home, away, scorers, mistakes) => {
  return new Promise((resolve, reject) => {
    conn.query('UPDATE Result SET home_score=?, away_score=?, goal_scorers=?, referee_mistakes=? WHERE fixture_id=?', [home, away, scorers, mistakes, fixture_id], (err, res) => {
      if (err) return reject(err);
      return resolve(res);
    })
  })
}

dataPool.listResults = () => {
  return new Promise((resolve, reject) => {
    conn.query(`
      SELECT r.*,
             f.home_team_id,
             f.away_team_id
        FROM Result r
        JOIN Fixture f ON f.id = r.fixture_id
      ORDER BY r.fixture_id DESC`, (err, res) => {
      if (err) return reject(err);
      resolve(rows);
    }

    );
  });
}
dataPool.listResultsByTeam = team_id => {
  return new Promise((resolve, reject) => {

    const sql = `
      SELECT r.fixture_id,
             r.home_score,
             r.away_score,
             f.home_team_id,
             f.away_team_id
        FROM Result  r
        JOIN Fixture f ON f.id = r.fixture_id
       WHERE f.home_team_id = ? OR f.away_team_id = ?`;

    conn.query(sql, [team_id, team_id], (err, rows) => {
      if (err) return reject(err);   
      return resolve(rows);          
    });

  });
};


/*-----RESOLVING DATABASE FOR TRANSFER------*/
dataPool.createTransfer = (player_id, from_team_id, to_team_id, user_id) => {
  return new Promise((resolve, reject) => {
    conn.query('INSERT INTO Transfer (player_id, from_team_id, to_team_id, submitted_by, approved) VALUES (?,?,?,?,0)', [player_id, from_team_id, to_team_id, user_id], (err, res) => {
      if (err) return reject(err);
      return resolve(res);
    })
  })
}

dataPool.approveTransfer = id => {
  return new Promise((resolve, reject) => {
    conn.query('UPDATE Transfer SET approved=1 WHERE id=?', [id], (err, res) => {
      if (err) return reject(err);
      return resolve(res);
    })
  })
}

dataPool.rejectTransfer = id => {
  return new Promise((resolve, reject) => {
    conn.query('DELETE FROM Transfer WHERE id=?', [id], (err, res) => {
      if (err) return reject(err);
      return resolve(res);
    })
  })
}

dataPool.listPendingTransfers = () => {
  return new Promise((resolve, reject) => {
    conn.query('SELECT * FROM Transfer WHERE approved=0', (err, res) => {
      if (err) return reject(err);
      return resolve(res);
    })
  })
}

/*-----RESOLVING DATABASE FOR FINE-------*/
dataPool.issueFine = (team_id, reason, amount) => {
  return new Promise((resolve, reject) => {
    conn.query('INSERT INTO Fine (team_id, reason, amount) VALUES (?,?,?)', [team_id, reason, amount], (err, res) => {
      if (err) return reject(err);
      return resolve(res);
    })
  })
}

dataPool.payFine = id => {
  return new Promise((resolve, reject) => {
    conn.query('UPDATE Fine SET paid=1 WHERE id=?', [id], (err, res) => {
      if (err) return reject(err);
      return resolve(res);
    })
  })
}

dataPool.listFines = team_id => {
  return new Promise((resolve, reject) => {
    if (!team_id) return resolve([]);
    conn.query('SELECT * FROM Fine WHERE id=?', [team_id], (err, res) => {
      if (err) return reject(err);
      return resolve(res);
    })
  })
}

//---------RESOLVING DATABSE FOR USERS
dataPool.getUserByUsername = username => {
  return new Promise((resolve, reject) => {
    conn.query('SELECT * FROM User WHERE username = ?', [username], (err, res) => {
      if (err) return reject(err);
      resolve(res);
    });
  });
};

dataPool.listPlayers = (team_id) => {
  return new Promise((resolve, reject) => {
    let sql = 'SELECT id, name FROM Player';
    let params = [];

    if (team_id) {
      sql = 'SELECT id, name FROM Player WHERE team_id = ?';
      params = [team_id];
    }

    conn.query(sql, params, (err, res) => {
      if (err) return reject(err);
      resolve(res);
    });
  });
};

//-------------RESOLVING DATABSE FOR COMPLAINT
dataPool.createComplaint = (teamId, fixtureId, message) => {
  return new Promise((resolve, reject) => {
    conn.query(
      'INSERT INTO Complaint (team_id, fixture_id, message) VALUES (?,?,?)',
      [teamId, fixtureId, message],
      (err, res) => {
        if (err) return reject(err);
        resolve(res);
      }
    );
  });
};

dataPool.listComplaints = () => {
  return new Promise((resolve, reject) => {
    conn.query('SELECT * FROM Complaint', (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
};

module.exports = dataPool;
