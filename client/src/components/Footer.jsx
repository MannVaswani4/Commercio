import React from 'react';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  background-color: var(--secondary-color);
  color: var(--white);
  padding: 1.5rem 0;
  text-align: center;
  margin-top: auto;
`;

const Copy = styled.p`
  font-size: 0.9rem;
  color: #94A3B8;
`;

const Footer = () => {
    return (
        <FooterContainer>
            <Copy>&copy; {new Date().getFullYear()} Commercio. All Rights Reserved.</Copy>
        </FooterContainer>
    );
};

export default Footer;
