import React, { createContext, useContext, useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-expo';

const UserRoleContext = createContext();

export const UserRoleProvider = ({ children }) => {
  const { user, isLoaded } = useUser();
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isLoaded && user) {
      // Get role from Clerk metadata (stored during signup)
      const role = user.unsafeMetadata?.role || 'asha_worker';
      setUserRole(role);
      setIsLoading(false);
      console.log('User role loaded:', role); // Debug log
    } else if (isLoaded) {
      setIsLoading(false);
    }
  }, [user, isLoaded]);

  const hasPermission = (permission) => {
    const permissions = {
      asha_worker: ['submit_reports', 'view_learning', 'view_water_quality'],
      health_official: ['view_all_reports', 'manage_workers', 'view_analytics', 'submit_reports', 'view_learning']
    };
    
    return permissions[userRole]?.includes(permission) || false;
  };

  const isASHAWorker = userRole === 'asha_worker';
  const isHealthOfficial = userRole === 'health_official';

  return (
    <UserRoleContext.Provider value={{
      userRole,
      isLoading,
      hasPermission,
      isASHAWorker,
      isHealthOfficial,
    }}>
      {children}
    </UserRoleContext.Provider>
  );
};

export const useUserRole = () => {
  const context = useContext(UserRoleContext);
  if (!context) {
    throw new Error('useUserRole must be used within UserRoleProvider');
  }
  return context;
};