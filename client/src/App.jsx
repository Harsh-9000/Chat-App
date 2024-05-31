import axios from "axios"
import { Outlet } from "react-router-dom";


function App() {
  axios.defaults.baseURL = 'http://localhost:3000/api';
  axios.defaults.withCredentials = true;

  return (
    <main>
      <Outlet />
    </main>
  )
}

export default App
