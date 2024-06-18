import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../routes/auth'; 

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    logout();
    navigate('/login'); 
  }, [navigate]);

  return (
    <div>
      <h1>Logging out...</h1>
    </div>
  );
};

export default Logout;
