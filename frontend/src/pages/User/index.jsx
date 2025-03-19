import React from 'react';
import UserDashboard from '../../components/Dashboard/UserDashboard';
import { Link } from 'react-router-dom';

const UserPage = () => {
  return (
    <div>
      <UserDashboard />
      <Link to="/generate-csr">Go to CSR Generation Page</Link>
    </div>
  );
};

export default UserPage;
