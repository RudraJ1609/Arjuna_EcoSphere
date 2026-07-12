import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { UserRole } from '../types';

interface RoleGateProps {
  allow: UserRole[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const RoleGate: React.FC<RoleGateProps> = ({ allow, children, fallback = null }) => {
  const currentUser = useSelector((state: RootState) => state.auth.currentUser);

  if (currentUser && allow.includes(currentUser.role)) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
};
