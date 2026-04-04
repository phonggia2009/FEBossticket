import React from 'react';
import { useRegister } from './useRegister';
import RegisterBanner from './components/RegisterBanner';
import RegisterForm from './components/RegisterForm';

const Register: React.FC = () => {
  const registerProps = useRegister();

  return (
    <div className="flex min-h-screen bg-black">
      <RegisterForm {...registerProps} />
      <RegisterBanner />
    </div>
  );
};

export default Register;