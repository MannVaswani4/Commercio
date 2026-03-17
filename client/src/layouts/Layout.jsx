import React from 'react';
import styled from 'styled-components';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const Main = styled.main`
  flex: 1;
  max-width: var(--max-w);
  margin: 0 auto;
  width: 100%;
  padding: 2.5rem var(--side-pad) 4rem;

  @media (max-width: 768px) {
    padding: 1.5rem var(--side-pad) 3rem;
  }
`;

const Layout = () => {
  return (
    <Wrapper>
      <Header />
      <Main>
        <Outlet />
      </Main>
      <Footer />
    </Wrapper>
  );
};

export default Layout;
