import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AuthCallbackPage = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { loginWithToken } = useAuth();

  useEffect(() => {
    const token = params.get('token');
    const id    = params.get('id');
    const name  = params.get('name');
    const email = params.get('email');
    const role  = params.get('role');

    if (token && id && name && email && role) {
      loginWithToken(token, { id, name, email, role: role as 'user' | 'admin' });
      navigate('/', { replace: true });
    } else {
      navigate('/login?error=oauth_failed', { replace: true });
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin w-12 h-12 border-4 border-ceylon-400 border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-white text-lg font-medium">Signing you in...</p>
        <p className="text-gray-400 text-sm mt-1">Please wait</p>
      </div>
    </div>
  );
};

export default AuthCallbackPage;