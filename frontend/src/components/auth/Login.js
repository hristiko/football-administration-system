import api from '../../services/api';
import { useState } from 'react';
import { useNavigate } from 'react-router'

function Login(){
    const [unPas, setUnPas] = useState({ 
        username: '', 
        password: ''});
    const navigate = useNavigate();
    const [msg,   setMsg]   = useState(null);

    const handleLogin = async () => {
        try {
            await api.post('/auth/login', unPas);
            navigate('/');
        } catch (err) {
            setMsg({ type: 'error', text: 'Invalid username or password.' });
        }
    }

    return (
        <div className="container">

            {msg && (
                <div style={{
                    background: '#ffcccc', color: '#b30000',
                    padding: '8px', marginBottom: '12px', borderRadius: '6px'
                }}>
                    {msg.text}
                </div>
            )}

            <h2>Login</h2>
            <input type = "text" placeholder="Username"
                onChange={e => setUnPas({
                    ...unPas, 
                    username: e.target.value
                })}
            />

            <input type = "password" placeholder="Password"
                onChange={e => setUnPas({
                    ...unPas, 
                    password: e.target.value
                })}
            />

            <button onClick={() => handleLogin()}>Login</button>
        </div>
    )
}


export default Login;
