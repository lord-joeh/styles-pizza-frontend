// AdminRoute.js
import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const AdminRoute = () => {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <div className="loading-spinner">Loading...</div>;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  if (!user.isAdmin) return <Navigate to="/" replace />;
  return <Outlet />;
};

export default AdminRoute;
