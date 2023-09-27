import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/gnometodo_94637.png'

const Navbar = () => {
  return (
    <nav className="bg-blue-500 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-2xl font-semibold"><img src={logo} alt="" className='h-[30px] w-[30px] bg-white' /></Link>
        <div className="space-x-4">
          <Link to="/" className="text-white">Home</Link>
          <Link to="/login" className="text-white">Login</Link>
          <Link to="/register" className="text-white">Register</Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
