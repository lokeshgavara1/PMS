import React from 'react';
import { Navigate } from 'react-router-dom';
import { useRole, type SystemRole } from '../hooks';

interface RoleBasedRouteProps {
  children: React.ReactNode;
  requiredRoles: SystemRole[];
  fallbackPath?: string;
}

export default function RoleBasedRoute({
  children,
  requiredRoles,
  fallbackPath = '/dashboard',
}: RoleBasedRouteProps) {
  const { role } = useRole();

  // If user doesn't have required role, redirect
  if (!requiredRoles.includes(role)) {
    return <Navigate to={fallbackPath} replace />;
  }

  return <>{children}</>;
}
