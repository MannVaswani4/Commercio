import React, { useState } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiUser, FiMenu, FiX, FiChevronDown } from 'react-icons/fi';
import useAuthStore from '../store/authStore';
import api from '../services/api';

const HeaderWrap = styled.header`
  background: var(--bg-white);
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 0;
  z-index: 100;
`;

const Inner = styled.div`
  max-width: var(--max-w);
  margin: 0 auto;
  padding: 0 var(--side-pad);
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
`;

const Logo = styled(Link)`
  font-family: var(--font-heading);
  font-size: 1.4rem;
  font-weight: 800;
  color: var(--text);
  letter-spacing: -0.03em;
  flex-shrink: 0;

  span {
    color: var(--text-muted);
    font-weight: 300;
  }
`;

const NavLinks = styled.nav`
  display: flex;
  align-items: center;
  gap: 0.25rem;

  @media (max-width: 640px) {
    display: none;
  }
`;

const NavLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--text-muted);
  padding: 0.4rem 0.75rem;
  border-radius: var(--radius-sm);
  transition: color 0.15s, background 0.15s;
  white-space: nowrap;

  &:hover {
    color: var(--text);
    background: var(--border-light);
  }
`;

const UserMenu = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const UserBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--text-muted);
  background: none;
  border: none;
  padding: 0.4rem 0.75rem;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: color 0.15s, background 0.15s;

  &:hover {
    color: var(--text);
    background: var(--border-light);
  }
`;

const Dropdown = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  background: var(--bg-white);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
  min-width: 160px;
  overflow: hidden;
  z-index: 200;
`;

const DropdownItem = styled.button`
  width: 100%;
  text-align: left;
  padding: 0.75rem 1rem;
  background: none;
  border: none;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-muted);
  cursor: pointer;
  display: block;
  transition: background 0.15s, color 0.15s;

  &:hover {
    background: var(--border-light);
    color: var(--text);
  }
`;

const DropdownLink = styled(Link)`
  display: block;
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-muted);
  transition: background 0.15s, color 0.15s;

  &:hover {
    background: var(--border-light);
    color: var(--text);
  }
`;

const CartBadge = styled.span`
  background: var(--primary);
  color: #fff;
  font-size: 0.65rem;
  font-weight: 700;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: -4px;
`;

const Header = () => {
  const { userInfo, logout } = useAuthStore();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const logoutHandler = async () => {
    try {
      await api.post('/users/logout');
      logout();
      setOpen(false);
      navigate('/login');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <HeaderWrap>
      <Inner>
        <Logo to="/">COMMERCIO<span>.</span></Logo>

        <NavLinks>
          <NavLink to="/cart">
            <FiShoppingCart size={16} />
            Cart
          </NavLink>

          {userInfo ? (
            <UserMenu>
              <UserBtn onClick={() => setOpen((o) => !o)}>
                <FiUser size={16} />
                {userInfo.name.split(' ')[0]}
                <FiChevronDown size={14} />
              </UserBtn>
              {open && (
                <Dropdown>
                  <DropdownLink to="/profile" onClick={() => setOpen(false)}>Profile</DropdownLink>
                  {userInfo.role === 'admin' && (
                    <>
                      <DropdownLink to="/admin/productlist" onClick={() => setOpen(false)}>Products</DropdownLink>
                      <DropdownLink to="/admin/orderlist" onClick={() => setOpen(false)}>Orders</DropdownLink>
                      <DropdownLink to="/admin/userlist" onClick={() => setOpen(false)}>Users</DropdownLink>
                    </>
                  )}
                  <DropdownItem onClick={logoutHandler}>Sign out</DropdownItem>
                </Dropdown>
              )}
            </UserMenu>
          ) : (
            <NavLink to="/login">
              <FiUser size={16} />
              Sign In
            </NavLink>
          )}
        </NavLinks>
      </Inner>
    </HeaderWrap>
  );
};

export default Header;
