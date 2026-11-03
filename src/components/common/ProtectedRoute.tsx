import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import type { UserRole } from '../../types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-xs text-slate-500">
        Validating session state...
      </div>
    );
  }

  // If not logged in, route to appropriate portal login
  if (!isAuthenticated || !user) {
    const isRiderRoute = location.pathname.startsWith('/rider');
    const isAdminRoute = location.pathname.startsWith('/admin');
    const loginTarget = isAdminRoute
      ? '/admin/login'
      : isRiderRoute
      ? '/rider/login'
      : '/customer/login';

    return <Navigate to={loginTarget} state={{ from: location }} replace />;
  }

  // If role is restricted and doesn't match
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};
