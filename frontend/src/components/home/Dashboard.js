import api from '../../services/api';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import ResultList from '../shared/ResultList';

function Dashboard() {
    const [user, setUser] = useState(null);
    const [teamName, setTeamName] = useState(null);
    const [pending, setPending] = useState([]);
    const [rejected, setRejected] = useState([]);

    const navigate = useNavigate();

    const loadLists = () => {
        api.get('/team?status=pending').then(r  => setPending(r.data));

        api.get('/team?status=rejected').then(r => setRejected(r.data));
    };

    const handleDecision = (id, action) => {
        api.post(`/team/${id}/${action}`)
            .then(() => {
                setPending(prev => prev.filter(t => t.id !== id));
                setRejected(prev => prev.filter(t => t.id !== id));
            })
            .catch(err => console.error(err));
    };

    useEffect(() => {
        api.get('/auth/me')
            .then(res => {
                setUser(res.data);

                if (res.data.role === 'team_rep') {
                    api.get(`/team/${res.data.team_id}`)
                        .then(t => setTeamName(t.data.name));
                }

                if (res.data.role === 'federation_stuff') {
                    loadLists();
                }

            })
            .catch(() => navigate('/login'));
    }, [navigate]);

    if (!user) return <div>Loading…</div>;

    return (
        <div className="container">
            <h1>Welcome, {user.username}</h1>

            {user.role === 'team_rep' && (
                <h3>
                    Role: team representative {user.username}, with id: {user.id}, of {teamName}
                </h3>
            )}

            {user.role === 'federation_stuff' && (
                <h3>
                    Role: federation staff {user.username}, with id: {user.id}
                </h3>
            )}

            {user.role === 'team_rep' && (
                <>
                    <div>
                        <button onClick={() => navigate('/team')}>Submit Team Info</button>
                        <button onClick={() => navigate('/lineup')}>Submit Line-up</button>
                        <button onClick={() => navigate('/transfer')}>Submit Transfer</button>
                        <button onClick={() => navigate('/complaint')}>Submit Complaint</button>
                    </div>

                    <ResultList teamId={user.team_id} />
                </>
            )}

            {user.role === 'federation_stuff' && (
                <>
                    <div style={{ marginBottom: 12 }}>
                        <button onClick={() => navigate('/fixture')}>Create Fixture</button>
                        <button onClick={() => navigate('/result')}>Enter Match Result</button>
                        <button onClick={() => navigate('/fine')}>Issue Fine</button>
                    </div>

                    {pending.length > 0 && (
                        <div className="panel">
                            <h4>Pending teams</h4>
                            {pending.map(t => (
                                <div key={t.id} style={{ marginBottom: 4 }}>
                                    {t.id} — {t.name}
                                    <button
                                        style={{ marginLeft: 8 }}
                                        onClick={() => handleDecision(t.id, 'approve')}
                                    >Correct</button>
                                    <button
                                        style={{ marginLeft: 4 }}
                                        onClick={() => handleDecision(t.id, 'reject')}
                                    >Reject</button>
                                </div>
                            ))}
                        </div>
                    )}

                    {rejected.length > 0 && (
                        <div className="panel" style={{ marginTop: 16 }}>
                            <h4>Rejected teams (await resubmission)</h4>
                            {rejected.map(t => (
                                <div key={t.id}>{t.id} — {t.name}</div>
                            ))}
                        </div>
                    )}


                </>
            )}
        </div>
    );
}

export default Dashboard;
