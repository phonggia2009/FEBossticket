import React from 'react';
import { useLogin } from './useLogin';
import LoginBanner from './components/LoginBanner';
import LoginForm from './components/LoginForm';

const Login: React.FC = () => {
  const loginProps = useLogin();

  return (
    <div className="flex min-h-screen bg-black">
      <LoginBanner />
      <LoginForm {...loginProps} />
    </div>
  );
};

export default Login;