import api from '../../services/api';
import { useState } from 'react';
import FixtureSelect from '../shared/FixtureSelect';
import Message from '../shared/Message';

function EnterResult() {
    const [result, setResult] = useState({
        fixture_id: '',
        home: '',
        away: '',
        scorers: '',
        mistakes: '',
    });

    const [msg, setMsg] = useState(null);

    const handleSubmit = async () => {
        try {
            await api.post('/result', result);
            setMsg({ type: 'success', text: 'Saved!' });
        } catch (err) {
            console.error(err);
            setMsg({ type: 'error', text: 'Failed.' });
        }
    };

    return (
        <div className="container">
            {msg && <Message type={msg.type} text={msg.text} />}
            <h2>Enter Match Result</h2>

            <FixtureSelect 
                value={result.fixture_id}
                onChange={e => setResult({
                    ...result,
                    fixture_id: e.target.value
                })}
            />

            <input
                type="number"
                placeholder='Home Score'
                onChange={e => setResult({
                    ...result,
                    home: e.target.value
                })}
            />
            <input
                type="number"
                placeholder='Away Score'
                onChange={e => setResult({
                    ...result,
                    away: e.target.value
                })}
            />
            <textarea
                placeholder='Goal Scorers'
                onChange={e => setResult({
                    ...result,
                    scorers: e.target.value
                })}
            />
            <textarea
                placeholder='Referee Mistakes (optional)'
                onChange={e => setResult({
                    ...result,
                    mistakes: e.target.value
                })}
            />
            <button onClick={handleSubmit}>Save Result</button>
            
        </div>
    );
}

export default EnterResult;