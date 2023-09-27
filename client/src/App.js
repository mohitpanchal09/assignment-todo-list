import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Login from './pages/LoginPage';
import Register from './pages/RegisterPage';
import Home from './pages/HomePage';
import Main from './pages/MainPage';

function App() {
  return (
    <Router>
        <Routes>
          <Route path='/' element={<Main />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path='/todo' element={<Home />} />
        </Routes>
    </Router>
  );
}

export default App;
