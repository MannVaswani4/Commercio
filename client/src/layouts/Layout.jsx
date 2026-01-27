import React from 'react';
import styled from 'styled-components';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Main = styled.main`
  min-height: 80vh;
  padding: 3rem 0;
  max-width: 1400px;
  margin: 0 auto;
  width: 92%;
  
  @media (max-width: 768px) {
    width: 90%;
    padding: 2rem 0;
  }
`;

const Layout = () => {
  return (
    <>
      <Header />
      <Main>
        <Outlet />
      </Main>
      <Footer />
    </>
  );
};

export default Layout;
