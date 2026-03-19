import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  flex-direction: column;
  gap: 1rem;
  color: var(--text-muted);
  font-size: 0.9rem;
`;

const Spinner = styled.div`
  width: 32px;
  height: 32px;
  border: 2.5px solid var(--border);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

/**
 * Handle the redirect from Google OAuth.
 * The server appends userInfo as query params after a successful login.
 */
const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const { setUserInfo } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = searchParams.get('accessToken');
    const error = searchParams.get('error');

    if (error) {
      navigate('/login?error=' + error);
      return;
    }

    if (accessToken) {
      const userInfo = {
        accessToken,
        _id: searchParams.get('_id'),
        name: searchParams.get('name'),
        email: searchParams.get('email'),
        role: searchParams.get('role'),
        avatar: searchParams.get('avatar') || null,
      };
      setUserInfo(userInfo);
      navigate('/');
    } else {
      navigate('/login');
    }
  }, []);

  return (
    <Wrapper>
      <Spinner />
      <span>Signing you in...</span>
    </Wrapper>
  );
};

export default AuthCallback;
