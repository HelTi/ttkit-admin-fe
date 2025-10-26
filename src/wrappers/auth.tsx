import React from 'react';
import type { ReactNode } from 'react';
import { Navigate, useAccess, useLocation } from 'umi';

interface AuthWrapperProps {
  children: ReactNode;
  route: any;
}

const AuthWrapper: React.FC<AuthWrapperProps> = ({ children, route }) => {
  const access = useAccess();
  const location = useLocation();
  const accessKey = route?.access;

  if (accessKey) {
    const checker = access?.[accessKey];
    const canAccess = typeof checker === 'function' ? checker(route) : checker;

    if (!canAccess) {
      return <Navigate to="/login" state={{ from: location.pathname }} replace />;
    }
  }

  return <>{children}</>;
};

export default AuthWrapper;
