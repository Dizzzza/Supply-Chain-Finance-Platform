import React from 'react';

const RoleBasedAccess = ({ userRole, allowedRoles, children, fallback = null }) => {
  const hasAccess = allowedRoles.includes(userRole);

  if (!hasAccess) {
    return fallback;
  }

  return children;
};

export default RoleBasedAccess; 