import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import useAuthentication from '../../hooks/useAuthentication';

const ProtectedRoute = ({ role, children }) => {
  const { AuthCtx } = useAuthentication();
  const { loggedInUser, hasUserRole } = useContext(AuthCtx);

  if (!loggedInUser || !hasUserRole(role)) {
    return <Navigate to="/home" />;
  }

  return children;
};

export default ProtectedRoute;
