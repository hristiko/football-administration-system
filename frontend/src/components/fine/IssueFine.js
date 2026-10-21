import api from '../../services/api';
import { useState } from 'react';
import TeamSelect from '../shared/TeamSelect';
import Message from '../shared/Message';

function IssueFine() {
    const[fine, setFine] = useState({
        team_id: '',
        reason: '',
        amount: ''
    });

    const [msg, setMsg] = useState(null);

    const handleSubmit = async () => {
        try {
            await api.post('/fine', fine);
            setMsg({ type: 'success', text: 'Saved!' });
        } catch (err) {
            console.error(err);
            setMsg({ type: 'error', text: 'Failed.' });
        }
    };

    return (
        <div className='container'>
            {msg && <Message type={msg.type} text={msg.text} />}
            <h2>Issue Fine</h2>
            
            <TeamSelect
                label="Team"
                value={fine.team_id}
                onChange={e =>
                    setFine({ ...fine, team_id: e.target.value })}
            />

            <input 
                type='text'
                placeholder='Reason'
                onChange={e => setFine({
                    ...fine, 
                    reason: e.target.value
                })} 
            />

            <input 
                type='number'
                placeholder='Amount'
                onChange={e => setFine({
                    ...fine, 
                    amount: e.target.value
                })} 
            />

            <button onClick={handleSubmit}>Issue Fine</button>

        </div>
    )
}

export default IssueFine;
