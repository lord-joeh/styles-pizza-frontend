// PrivateRoute.js
import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const PrivateRoute = () => {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <div className="loading-spinner">Loading...</div>;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  return <Outlet />;
};

export default PrivateRoute;
