import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import Button from '../components/Button';
import Input from '../components/Input';
import useAuthStore from '../store/authStore';
import api from '../services/api';

const ProfileGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Section = styled.div`
  background: var(--bg-white);
  padding: 2rem;
  border-radius: var(--radius-lg);
  border: 1px solid var(--border);
  
  h2 {
    margin-bottom: 1.5rem;
    font-size: 1.25rem;
    letter-spacing: -0.02em;
  }
`;

const Profile = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const { userInfo, setUserInfo } = useAuthStore();

    useEffect(() => {
        if (userInfo) {
            setName(userInfo.name);
            setEmail(userInfo.email);
        }
    }, [userInfo]);

    const submitHandler = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
        } else {
            try {
                const res = await api.put('/users/profile', {
                    name,
                    email,
                    password
                });
                setUserInfo({ ...res.data, accessToken: res.data.accessToken || userInfo.accessToken });
                // Note: API returns new access token, ensuring we keep it updated
                toast.success('Profile Updated Successfully');
            } catch (err) {
                toast.error(err?.response?.data?.message || err.message);
            }
        }
    };

    return (
        <ProfileGrid>
            <Section>
                <h2>User Profile</h2>
                <form onSubmit={submitHandler}>
                    <Input
                        label="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <Input
                        label="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <Input
                        label="New Password"
                        type="password"
                        placeholder="Min 6 characters"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Input
                        label="Confirm Password"
                        type="password"
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <Button type="submit">Update Profile</Button>
                </form>
            </Section>

            <Section>
                <h2>My Orders</h2>
                <p>Order history functionality coming soon...</p>
            </Section>
        </ProfileGrid>
    );
};

export default Profile;
