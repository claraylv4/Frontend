import React, { useState } from 'react';


function HomePage() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const DropDown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  
  const handleShowLogin = () => {
    window.location.href = '/login';
  };

  const handleShowLogOut = () => {
    window.location.href = '/';
  };

  const handleShowSignup = () => {
    window.location.href = '/signup';
  };


  return (
    <>
      <header className='header-style'>
        <input style={{ color: '#000000', position: 'fixed', top: '17px', left: '10px' }} placeholder='Search'/> 
        <button onClick={handleShowLogin} style={{ position: 'fixed', top: '17px', right: '10px' }}>Login</button>
        <button onClick={handleShowSignup} style={{ position: 'fixed', top: '17px', right: '60px' }}>Sign Up</button>
      </header>

      {/* Faig que "Chop-Chop" sigui un botó per fer clic */}
      <h1 onClick={DropDown} style={{ cursor: 'pointer' }}>Chop-Chop</h1>

      {/* Mostra el desplegable només si `isDropdownOpen` és true */}
      {isDropdownOpen && (
        <div style={{ border: '1px solid black', padding: '10px', position: 'absolute', background: 'white' }}>
          <a href="#" onClick={handleShowLogin} style={{ color: '#000', display: 'block', padding: '5px' }}>Log In</a>
          <br />
          <a href="#" onClick={handleShowSignup} style={{ color: '#000', display: 'block', padding: '5px' }}>Sign Up</a>
          <br /> 
          <a href="#" onClick={handleShowLogOut} style={{color: '#000', display: 'block', padding: '5px' }}>Log Out</a>
        </div>
      )}


    </>
  );
}

export default HomePage
