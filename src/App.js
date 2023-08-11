import { Routes, Route  } from "react-router-dom";
import {lazy} from 'react'
import './App.css'
import Home from './Home/Home'
import Register from './Register/Register'
import Login from './Login/Login'
function App() {
  return (
    <div className="App">
     <Routes>
        <Route path="/" element={<Home />} />
        <Route path="register" element={<Register />} />
        <Route path="login" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;
