import React, { useEffect } from 'react';
import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { history } from './helpers';
import  HomePage from './pages/HomePage';
import LoginPage from './pages/Login';
import { AuthCheck } from './components/AuthCheck';
import useAuth from './helpers/hooks/useAuth';

function App() {
  const dispatch = useDispatch();

  const { user } = useAuth();

  useEffect(() => {
    console.log('hello here app', user);
  }, [user]);

  return (
    <div className="container">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={user?.username ? <HomePage /> : <LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="*"
            element={<Navigate to="/" replace />}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
