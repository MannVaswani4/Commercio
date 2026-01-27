import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Nav = styled.nav`
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
`;

const Step = styled.div`
  margin: 0 1rem;
  
  a {
    color: ${(props) => (props.$active ? 'var(--primary-color)' : '#cbd5e1')};
    font-weight: 600;
    pointer-events: ${(props) => (props.$active ? 'auto' : 'none')};
  }
`;

const CheckoutSteps = ({ step1, step2, step3, step4 }) => {
    return (
        <Nav>
            <Step $active={step1}>
                <Link to="/login">Sign In</Link>
            </Step>
            <Step $active={step2}>
                <Link to="/shipping">Shipping</Link>
            </Step>
            <Step $active={step3}>
                <Link to="/payment">Payment</Link>
            </Step>
            <Step $active={step4}>
                <Link to="/placeorder">Place Order</Link>
            </Step>
        </Nav>
    );
};

export default CheckoutSteps;
