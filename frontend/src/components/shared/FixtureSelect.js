import api from '../../services/api';
import { useEffect, useState } from 'react';

function FixtureSelect({ value, onChange, teamId = null, label = 'Fixture' }) {
    const [fixtures, setFixtures] = useState([]);
    const [teams, setTeams] = useState({});
    
    useEffect(() => {
            api.get('/fixture', { params: teamId ? { team_id: teamId } : {} })
            .then(r => setFixtures(r.data || []))
            .catch(() => setFixtures([]));
    }, [teamId]);                 

    useEffect(() => {
        api.get('/team').then(r => {
            const map = {};
            r.data.forEach(t => (map[t.id] = t.name));
            setTeams(map);
        });
    }, []);

    return (
        <select value={value} onChange={onChange} required>
            <option value="">{label} ID…</option>
            {fixtures.map(f => (
                <option key={f.id} value={f.id}>
                    {f.id} – {teams[f.home_team_id] || f.home_team_id} {' vs '} {teams[f.away_team_id] || f.away_team_id}
                </option>
            ))}
        </select>
    );
}

export default FixtureSelect;