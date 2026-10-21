import api from '../../services/api';
import { useEffect, useState } from 'react';

function PlayerSelect({ teamId, value, onChange, label = 'Player' }) {
    const [players, setPlayers] = useState([]);

    useEffect(() => {
        if (!teamId) { setPlayers([]); return; }
        api.get(`/player?team_id=${teamId}`)
            .then(res => setPlayers(res.data));
    }, [teamId]);

    return (
        <select value={value} onChange={onChange} required>
            <option value="">{label} ID…</option>
            {players.map(p => (
                <option key={p.id} value={p.id}>
                    {p.name} (#{p.id})
                </option>
            ))}
        </select>
    );
}

export default PlayerSelect;