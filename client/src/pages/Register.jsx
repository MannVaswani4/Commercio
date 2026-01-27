import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import FormContainer from '../components/FormContainer';
import Button from '../components/Button';
import Input from '../components/Input';
import useAuthStore from '../store/authStore';
import api from '../services/api';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

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
        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        } else {
            try {
                const res = await api.post('/users', { name, email, password });
                setUserInfo(res.data);
                toast.success('Registration Successful, Welcome!');
                navigate(redirect);
            } catch (err) {
                toast.error(err?.response?.data?.message || err.message);
            }
        }
    };

    return (
        <FormContainer title="Register">
            <form onSubmit={submitHandler}>
                <Input
                    label="Name"
                    type="text"
                    placeholder="Enter name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

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

                <Input
                    label="Confirm Password"
                    type="password"
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />

                <Button type="submit">
                    Register
                </Button>
            </form>

            <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                Already have an account?{' '}
                <Link to={redirect ? `/login?redirect=${redirect}` : '/login'} style={{ color: 'var(--accent-color)' }}>
                    Login
                </Link>
            </div>
        </FormContainer>
    );
};

export default Register;
