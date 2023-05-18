import { useEffect, useCallback } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Protected from '../Protected/Protected';
import Chat from '../Chat/Chat';
import Login from '../Login/Login';
import { useAppDispatch } from '../../store/store';
import {
  handleLogin,
  handleLogout,
  setAuthChecking,
} from '../../store/slices/user';

const App: React.FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setAuthChecking(true));
    const id = localStorage.getItem('idInstance');
    const apiToken = localStorage.getItem('apiTokenInstance');

    if (id && apiToken) {
      dispatch(handleLogin(id, apiToken));
    }
    dispatch(setAuthChecking(false));
  }, [dispatch]);

  const handleLogoutAccount = useCallback(() => {
    localStorage.removeItem('idInstance');
    localStorage.removeItem('apiTokenInstance');
    localStorage.removeItem('chats');
    dispatch(handleLogout());
  }, [dispatch]);

  return (
    <div className="page">
      <Routes>
        <Route path="/signin" element={<Login />} />
        <Route
          path="/"
          element={
            <Protected>
              <Chat handleLogout={handleLogoutAccount} />
            </Protected>
          }
        />
        <Route path="*" element={<Navigate to="/signin" />} />
      </Routes>
    </div>
  );
};

export default App;
