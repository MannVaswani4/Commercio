import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import FormContainer from '../components/FormContainer';
import Button from '../components/Button';
import Input from '../components/Input';
import useAuthStore from '../store/authStore';
import api from '../services/api';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();
    const { userInfo, setUserInfo } = useAuthStore();

    const { search } = useLocation();
    const sp = new URLSearchParams(search);
    const redirect = sp.get('redirect') || '/';

    useEffect(() => {
        if (userInfo) {
            navigate(redirect);
        }
    }, [navigate, redirect, userInfo]);

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/users/login', { email, password });
            setUserInfo(res.data);
            toast.success('Login Successful');
            navigate(redirect);
        } catch (err) {
            toast.error(err?.response?.data?.message || err.message);
        }
    };

    return (
        <FormContainer title="Sign In">
            <form onSubmit={submitHandler}>
                <Input
                    label="Email Address"
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <Input
                    label="Password"
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <Button type="submit" disabled={false}>
                    Sign In
                </Button>
            </form>

            <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                New Customer?{' '}
                <Link to={redirect ? `/register?redirect=${redirect}` : '/register'} style={{ color: 'var(--accent-color)' }}>
                    Register
                </Link>
            </div>
        </FormContainer>
    );
};

export default Login;
