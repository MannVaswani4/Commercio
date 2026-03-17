import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const FooterWrap = styled.footer`
  background: var(--bg-white);
  border-top: 1px solid var(--border);
  padding: 2rem var(--side-pad);
  margin-top: auto;
`;

const Inner = styled.div`
  max-width: var(--max-w);
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const Logo = styled.span`
  font-family: var(--font-heading);
  font-size: 1rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--text);
`;

const Links = styled.div`
  display: flex;
  gap: 1.5rem;
`;

const FooterLink = styled(Link)`
  font-size: 0.825rem;
  color: var(--text-muted);
  font-weight: 500;
  transition: color 0.15s;

  &:hover {
    color: var(--text);
  }
`;

const Copy = styled.p`
  font-size: 0.8rem;
  color: var(--text-muted);
`;

const Footer = () => {
  return (
    <FooterWrap>
      <Inner>
        <Logo>COMMERCIO.</Logo>
        <Links>
          <FooterLink to="/">Shop</FooterLink>
          <FooterLink to="/cart">Cart</FooterLink>
          <FooterLink to="/login">Account</FooterLink>
        </Links>
        <Copy>&copy; {new Date().getFullYear()} Commercio</Copy>
      </Inner>
    </FooterWrap>
  );
};

export default Footer;
