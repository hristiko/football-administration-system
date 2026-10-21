import api from '../../services/api';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import FixtureSelect from '../shared/FixtureSelect';
import Message from '../shared/Message';

function SubmitComplaint() {
  const [complaint, setComplaint] = useState({
    team_id: '',
    fixture_id: '',
    message: ''
  });
  const [msg, setMsg] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/auth/me')
      .then(res =>
        setComplaint(c => ({ ...c, team_id: res.data.team_id }))
      )
      .catch(() => navigate('/login'));
  }, [navigate]);

  const handleSubmit = async () => {
    try {
      await api.post('/complaint', complaint);
      setMsg({ type: 'success', text: 'Saved!' });
    } catch (err) {
      console.error(err);
      setMsg({ type: 'error', text: 'Failed.' });
    }
  };

  return (
    <div className="container">
      {msg && <Message type={msg.type} text={msg.text} />}

      <h2>Submit Complaint</h2>

      <input value={complaint.team_id} readOnly style={{ marginBottom: 8 }} />

      <FixtureSelect
        teamId={complaint.team_id}
        value={complaint.fixture_id}
        onChange={e =>
          setComplaint({ ...complaint, fixture_id: e.target.value })}
      />

      <textarea
        placeholder="Message"
        onChange={e =>
          setComplaint({ ...complaint, message: e.target.value })}
      />

      <button onClick={handleSubmit}>Submit Complaint</button>
    </div>
  );
}

export default SubmitComplaint;
