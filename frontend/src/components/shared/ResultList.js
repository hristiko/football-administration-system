import { useEffect, useState } from 'react';
import api from '../../services/api';

function ResultList({ teamId }) {
  const [rows,  setRows]  = useState([]);
  const [names, setNames] = useState({});   

  useEffect(() => {
    api.get('/result', { params: teamId ? { team: teamId } : {} })
       .then(res => setRows(res.data || []))
       .catch(() => setRows([]));

    api.get('/team')
       .then(res => {
         const m = {};
         res.data.forEach(t => { m[t.id] = t.name; });
         setNames(m);
       });
  }, [teamId]);

  if (!rows.length) return null;

  return (
    <div className="panel" style={{ marginTop: 16 }}>
      <h4>Latest results</h4>
      {rows.map(res => (
        <div key={res.fixture_id}>
          {`Fixture #${res.fixture_id} – ${names[res.home_team_id] || res.home_team_id} `}
          {`${res.home_score}:${res.away_score} `}
          {`${names[res.away_team_id] || res.away_team_id}`}
        </div>
      ))}
    </div>
  );
}

export default ResultList;
