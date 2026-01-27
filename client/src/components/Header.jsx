import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaUser } from 'react-icons/fa';
import api from '../services/api';

const HeaderContainer = styled.header`
  background-color: var(--primary-color);
  color: var(--white);
  padding: 1rem 0;
  box-shadow: var(--shadow-md);
`;

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1400px;
  margin: 0 auto;
  width: 90%;
  
  @media (max-width: 768px) {
    width: 95%;
  }
`;

const Logo = styled(Link)`
  font-family: var(--font-heading);
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--white);
  letter-spacing: 1px;
  
  @media (max-width: 768px) {
    font-size: 1.3rem;
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2rem;
  align-items: center;
  
  @media (max-width: 768px) {
    gap: 1rem;
  }
`;

const NavLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  &:hover {
    color: var(--accent-color);
  }
`;

import useAuthStore from '../store/authStore';
import { useNavigate } from 'react-router-dom';

const Header = () => {
    const { userInfo, logout } = useAuthStore();
    const navigate = useNavigate();

    const logoutHandler = async () => {
        try {
            await api.post('/users/logout');
            logout();
            navigate('/login');
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <HeaderContainer>
            <Nav>
                <Logo to="/">COMMERCIO</Logo>
                <NavLinks>
                    <NavLink to="/cart">
                        <FaShoppingCart /> Cart
                    </NavLink>
                    {userInfo ? (
                        <>
                            <NavLink to="/profile">
                                <FaUser /> {userInfo.name}
                            </NavLink>
                            {userInfo.role === 'admin' && (
                                <NavLink to="/admin/productlist">
                                    Admin
                                </NavLink>
                            )}
                            <button onClick={logoutHandler} style={{ background: 'none', border: 'none', color: 'white', fontSize: '1rem', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>
                                Logout
                            </button>
                        </>
                    ) : (
                        <NavLink to="/login">
                            <FaUser /> Sign In
                        </NavLink>
                    )}
                </NavLinks>
            </Nav>
        </HeaderContainer>
    );
};

export default Header;
