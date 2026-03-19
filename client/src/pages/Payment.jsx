import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import FormContainer from '../components/FormContainer';
import Button from '../components/Button';
import CheckoutSteps from '../components/CheckoutSteps';
import useCartStore from '../store/cartStore';
import { FiCreditCard } from 'react-icons/fi';

const CodCard = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  border: 1.5px solid var(--primary);
  border-radius: var(--radius-md);
  background: var(--border-light);
  margin: 1.5rem 0 2rem;
`;

const CodIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--primary);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const CodText = styled.div`
  h3 { font-size: 0.95rem; font-weight: 700; margin-bottom: 0.2rem; }
  p  { font-size: 0.8rem; color: var(--text-muted); }
`;

const Payment = () => {
    const { shippingAddress, savePaymentMethod } = useCartStore();
    const navigate = useNavigate();

    useEffect(() => {
        if (!shippingAddress.address) navigate('/shipping');
    }, [shippingAddress, navigate]);

    const submitHandler = (e) => {
        e.preventDefault();
        savePaymentMethod('Cash on Delivery');
        navigate('/placeorder');
    };

    return (
        <FormContainer title="Payment" subtitle="Review your payment method before placing the order.">
            <CheckoutSteps step1 step2 step3 />
            <form onSubmit={submitHandler}>
                <CodCard>
                    <CodIcon><FiCreditCard size={18} /></CodIcon>
                    <CodText>
                        <h3>Cash on Delivery</h3>
                        <p>Pay when your order arrives at your door.</p>
                    </CodText>
                </CodCard>
                <Button type="submit">Continue to Order Review</Button>
            </form>
        </FormContainer>
    );
};

export default Payment;
