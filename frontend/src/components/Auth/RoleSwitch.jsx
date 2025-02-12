import React from 'react';
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';

const RoleSwitch = ({ role, setRole }) => {
  return (
    <ButtonGroup variant="contained" fullWidth>
      <Button
        color={role === 'user' ? 'primary' : 'inherit'}
        onClick={() => setRole('user')}
      >
        User
      </Button>
      <Button
        color={role === 'admin' ? 'primary' : 'inherit'}
        onClick={() => setRole('admin')}
      >
        Admin
      </Button>
    </ButtonGroup>
  );
};

export default RoleSwitch;