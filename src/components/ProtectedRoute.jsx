import { Navigate } from 'react-router';

const ProtectedRoute = ({ element, allowedRoles }) => {
  const getUserRole = () => {
    return localStorage.getItem('userRole');
  };
  const userRole = getUserRole();
  return allowedRoles.includes(userRole) ? (
    element
  ) : (
    <Navigate to="/unauthorized" />
  );
};

export default ProtectedRoute;
