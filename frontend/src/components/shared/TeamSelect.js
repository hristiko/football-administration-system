import api from '../../services/api';
import { useEffect, useState } from 'react';

function TeamSelect({ value, onChange, label = 'Team' }) {
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    api.get('/team').then(res => setTeams(res.data));
  }, []);

  return (
    <select value={value} onChange={onChange} required>
      <option value="">{label} ID…</option>
      {teams.map(t => (
        <option key={t.id} value={t.id}>
          {t.name} (#{t.id})
        </option>
      ))}
    </select>
  );
}

export default TeamSelect;