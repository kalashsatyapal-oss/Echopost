import { Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import { useSelector } from "react-redux";
import SuperadminDashboard from "./pages/SuperadminDashboard";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
function App() {
  const { token } = useSelector((s) => s.auth);

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/dashboard"
        element={token ? <Dashboard /> : <Navigate to="/login" />}
      />
      <Route
        path="/superadmin"
        element={token ? <SuperadminDashboard /> : <Navigate to="/login" />}
      />
       <Route path="/profile" element={token ? <Profile /> : <Navigate to="/login" />} />
      <Route path="/settings" element={token ? <Settings /> : <Navigate to="/login" />} />
    </Routes>
  );
}

export default App;
