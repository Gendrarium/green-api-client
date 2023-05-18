import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../../store/store';
import { selectAuthChecking, selectLoggedIn } from '../../store/slices/user';

// import Preloader from '../Preloader/Preloader';

interface ProtectedProps {
  children: React.ReactElement;
}

const Protected: React.FC<ProtectedProps> = ({ children }) => {
  const loggedIn = useAppSelector(selectLoggedIn);
  const authChecking = useAppSelector(selectAuthChecking);

  return authChecking ? (
    // <Preloader isVisible={authChecking} />
    <p>жди</p>
  ) : loggedIn ? (
    children
  ) : (
    <Navigate to="/signin" />
  );
};

export default Protected;
