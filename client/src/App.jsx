import { useEffect, useState } from "react";
import axios from "axios";
import { Outlet } from "react-router-dom";
import { SocketProvider } from './contexts/SocketContext';
import { useSelector } from "react-redux";

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const user = useSelector(state => state.user)

  axios.defaults.baseURL = `${import.meta.env.VITE_APP_BACKEND_URL}/api`;
  axios.defaults.withCredentials = true;

  useEffect(() => {
    const newToken = localStorage.getItem('token');
    setToken(newToken);
  }, [user.token]);

  return (
    <SocketProvider token={token}>
      <main>
        <Outlet />
      </main>
    </SocketProvider>
  );
}

export default App;