import api from '../../services/api';
import { useState } from 'react';
import TeamSelect from '../shared/TeamSelect'
import Message from '../shared/Message'; 

function CreateFixture(){
    const [fixture, setFixture] = useState({
        home_team: '',
        away_team: '',
        match_date: '',
        stadium: '',
    });

    const [msg, setMsg] = useState(null);

    const handleSubmit = async () => {
        try {
            await api.post('/fixture', fixture);
            setMsg({ type: 'success', text: 'Saved!' });
            
        } catch (err) {
            console.error(err);
            setMsg({ type: 'error', text: 'Failed.' });
            
        }
    };

    return (
        <div className='container'>
            {msg && <Message type={msg.type} text={msg.text} />}
            <h2>Create Fixture</h2>
            <TeamSelect 
                label='Home Team'
                value={fixture.home_team}
                onChange={e => setFixture({
                    ...fixture,
                    home_team: e.target.value
                })}
            />
            <TeamSelect 
                label='Away Team'
                value={fixture.away_team}
                onChange={e => setFixture({
                    ...fixture,
                    away_team: e.target.value
                })}
            />
            <input
                type="datetime-local"
                placeholder="YYYY-MM-DD HH:MM"
                onChange={e => setFixture({ 
                    ...fixture, 
                    match_date: e.target.value })
                }
            />
            <input
                type='text'
                placeholder='Stadium'
                onChange={e => setFixture({
                    ...fixture,
                    stadium: e.target.value})}
            />
            <button onClick={handleSubmit}>Create</button>
        </div>
    )
}

export default CreateFixture;