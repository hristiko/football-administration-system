import api from '../../services/api';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import FixtureSelect from '../shared/FixtureSelect';
import PlayerSelect from '../shared/PlayerSelect';
import Message from '../shared/Message';

const slots = 11;

const initPlayers = () => {
    const a = [];
    for (let i = 0; i < slots; i++) a.push({ id: '', starting: true });
    return a;
};

function SubmitLineup() {
    const [teamId, setTeamId] = useState('');
    const [fixtureId, setFixtureId] = useState('');
    const [players, setPlayers] = useState(initPlayers);
    const [msg, setMsg] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        api.get('/auth/me')
            .then(r => setTeamId(r.data.team_id))
            .catch(() => navigate('/login'));
    }, [navigate]);

    const handleSubmit = async () => {
        let filled = 0, clean = [];
        for (const p of players) {
            if (p.id) { filled++; clean.push(p); }
        }

        if (filled !== slots) {
            setMsg({ type: 'error', text: `Exactly ${slots} players required` });
            return;
        }

        try {
            await api.post('/lineup', {
                fixture_id: fixtureId,
                team_id: teamId,
                players: clean
            });
            setMsg({ type: 'success', text: 'Line-up submitted!' });
        } catch (err) {
            console.error(err);
            setMsg({ type: 'error', text: 'Submission failed.' });
        }
    };

    return (
        <div className="container">
            {msg && <Message type={msg.type} text={msg.text} />}

            <h2>Submit Starting Line-up</h2>

            <FixtureSelect
                teamId={teamId}
                value={fixtureId}
                onChange={e => setFixtureId(e.target.value)}
            />

            <input
                value={teamId ? `Team #${teamId}` : 'Loading…'}
                readOnly
                style={{ margin: '8px 0' }}
            />

            {players.map((p, i) => (
                <PlayerSelect
                    key={i}
                    label={`Player ${i + 1}`}
                    teamId={teamId}
                    value={p.id}
                    onChange={e => {
                        const updated = [];   

                        for (let j = 0; j < players.length; j++) {
                            if (j === i) {
                                updated[j] = { 
                                    ...players[j], 
                                    id: e.target.value };
                            } else {
                                updated[j] = players[j];
                            }
                        }

                        setPlayers(updated);   
                    }}
                />
            ))}

            <button onClick={handleSubmit}>Submit Line-up</button>
        </div>
    );
}

export default SubmitLineup;
