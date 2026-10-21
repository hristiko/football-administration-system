import api from '../../services/api';
import { useState } from 'react';
import TeamSelect from '../shared/TeamSelect';
import PlayerSelect from '../shared/PlayerSelect';
import Message from '../shared/Message';


const window_end = new Date('2025-08-30T23:59:59');
const daysLeft = () => Math.max(0,
    Math.ceil((window_end - Date.now()) / 86_400_000));

function SubmitTransfer() {
    const [transfer, setTransfer] = useState({
        player_id: '',
        from_team_id: '',
        to_team_id: '',
        user_id: '',
        file: null
    });

    const [msg, setMsg] = useState(null);


    const handleSubmit = async () => {
        const formData = new FormData();

        if (transfer.from_team_id) formData.append('from_team_id', transfer.from_team_id);
        if (transfer.player_id) formData.append('player_id', transfer.player_id);
        if (transfer.to_team_id) formData.append('to_team_id', transfer.to_team_id);
        if (transfer.user_id) formData.append('user_id', transfer.user_id);
        if (transfer.file) formData.append('file', transfer.file);

        try {
            await api.post('/transfer', formData);
            setMsg({ type: 'success', text: 'Saved!' });
        } catch (err) {
            console.error(err);
            setMsg({ type: 'error', text: 'Failed.' });
        }
    };

    return (
        <div className="container">
            {msg && <Message type={msg.type} text={msg.text} />}
            <Message type="info" text={`Window closes in ${daysLeft()} day(s)`} />

            <h2>Submit Player Transfer</h2>

            <TeamSelect
                label="From team"
                value={transfer.from_team_id}
                onChange={e =>
                    setTransfer({ ...transfer, from_team_id: e.target.value })}
            />

            <PlayerSelect
                teamId={transfer.from_team_id}
                value={transfer.player_id}
                onChange={e => setTransfer({
                    ...transfer,
                    player_id: e.target.value
                })}
            />

            <TeamSelect
                label="To team"
                value={transfer.to_team_id}
                onChange={e =>
                    setTransfer({ ...transfer, to_team_id: e.target.value })}
            />

            <input type="number" placeholder="User ID"
                onChange={e => setTransfer({
                    ...transfer,
                    user_id: e.target.value
                })} />

            <input type="file" onChange={e => setTransfer({
                ...transfer,
                file: e.target.files[0]
            })} />

            <button onClick={handleSubmit}>Submit Transfer</button>
        </div>
    );
}



export default SubmitTransfer;
