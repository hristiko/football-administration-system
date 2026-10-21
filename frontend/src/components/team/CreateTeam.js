import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import api from '../../services/api';
import Message from '../shared/Message';


function CreateTeam() {

    const [state, setState] = useState({
        name: '',
        stadium_name: '',
        logo: null
    });


    const [teamStatus, setTeamStatus] = useState(null);
    const [teamId, setTeamId] = useState(null);
    const [msg, setMsg] = useState(null);

    const navigate = useNavigate();


    useEffect(() => {
        api.get('/auth/me')
            .then(me => {
                if (!me.data.team_id) return;
                setTeamId(me.data.team_id);
                return api.get(`/team/${me.data.team_id}`);
            })
            .then(res => {
                if (!res) return;
                setTeamStatus(res.data.compliance_status);

                setState({
                    name: res.data.name,
                    stadium_name: res.data.stadium_name,
                    logo: null
                });


                
            })
            .catch(() => navigate('/login'));
    }, [navigate]);


    const handleSubmit = async () => {
        if (!state.name || !state.stadium_name) {
            setMsg({ type: 'error', text: 'All fields are required.' });
            return;
        }

        const form = new FormData();
        form.append('name', state.name);
        form.append('stadium_name', state.stadium_name);
        if (state.logo) form.append('logo', state.logo);

        try {
            await api.put(`/team/${teamId}`, form);
            setMsg({ type: 'success', text: 'Saved!' });
        } catch (err) {
            console.error('team update failed', err);
            setMsg({ type: 'error', text: 'Failed.' });
        }
    };


    return (
        <div className="container">

            {msg && <Message type={msg.type} text={msg.text} />}


            {teamStatus === -1 && (
                <>
                    <Message type="info" text="Previous submission was rejected. Resubmission deadline: 7 days"/> 
                </>
            )}

            <h2>Update Team Info</h2>

            <input
                type="text"
                placeholder="Team Name"
                value={state.name}
                onChange={e => setState({ ...state, name: e.target.value })}
            />

            <input
                type="text"
                placeholder="Stadium Name"
                value={state.stadium_name}
                onChange={e => setState({ ...state, stadium_name: e.target.value })}
            />

            <input
                type="file"
                onChange={e => setState({ ...state, logo: e.target.files[0] })}
            />

            <button onClick={handleSubmit}>Save</button>
        </div>
    );
}

export default CreateTeam;
