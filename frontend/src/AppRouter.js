import { BrowserRouter, Routes, Route } from 'react-router';
import Dashboard from './components/home/Dashboard';
import Login from './components/auth/Login';
import CreateTeam from './components/team/CreateTeam';
import CreateFixture from './components/fixture/CreateFixture';
import SubmitLineup from './components/lineup/SubmitLineup';
import EnterResult from './components/result/EnterResult';
import SubmitTransfer from './components/transfer/SubmitTransfer';
import IssueFine from './components/fine/IssueFine';
import SubmitComplaint from './components/complaint/SubmitComplaint';
import logo from './assets/ffm-logo.png';

function Header() {
  return (
    <header style={{ padding: '10px', textAlign: 'center' }}>
      <img src={logo} alt="FFM" height="60" />
      <h2>Information System - Football Officials</h2>
    </header>
  );
}

function AppRouter() {
    return(
        <BrowserRouter>
            <Header/>
            <Routes>
                
                <Route path="/" element={<Dashboard />}/>
                <Route path="/login" element={<Login />}/>
                <Route path="/team" element={<CreateTeam />}/>
                <Route path="/fixture" element={<CreateFixture />}/>
                <Route path="/lineup" element={<SubmitLineup />}/>
                <Route path="/result" element={<EnterResult />}/>
                <Route path="/transfer" element={<SubmitTransfer />}/>
                <Route path="/fine" element={<IssueFine />}/>
                <Route path="/complaint" element={<SubmitComplaint />}/>
            </Routes>
        </BrowserRouter>
    )
}

export default AppRouter;