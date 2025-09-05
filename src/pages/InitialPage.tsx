import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth';

const InitialPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isAuthInitialized } = useAuthStore();

  useEffect(() => {
    if (!isAuthInitialized) {
      return;
    }

    const hasOnboarded = localStorage.getItem('hasOnboarded');

    if (!hasOnboarded) {
      navigate('/onboarding');
    } else {
      if (isAuthenticated) {
        navigate('/main');
      } else {
        navigate('/login');
      }
    }
  }, [navigate, isAuthenticated, isAuthInitialized]);

  return null;
};

export default InitialPage;
