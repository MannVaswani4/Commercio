import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import FormContainer from '../components/FormContainer';
import Button from '../components/Button';
import CheckoutSteps from '../components/CheckoutSteps';
import useCartStore from '../store/cartStore';

const RadioGroup = styled.div`
    margin: 1.5rem 0;

    label {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 1.1rem;
        cursor: pointer;
    }
`;

const Payment = () => {
    const { shippingAddress, savePaymentMethod } = useCartStore();
    const navigate = useNavigate();

    const [paymentMethod, setPaymentMethod] = useState('PayPal');

    useEffect(() => {
        if (!shippingAddress.address) {
            navigate('/shipping');
        }
    }, [shippingAddress, navigate]);

    const submitHandler = (e) => {
        e.preventDefault();
        savePaymentMethod(paymentMethod);
        navigate('/placeorder');
    };

    return (
        <FormContainer title="Payment Method">
            <CheckoutSteps step1 step2 step3 />
            <form onSubmit={submitHandler}>
                <RadioGroup>
                    <label>
                        <input
                            type="radio"
                            name="paymentMethod"
                            value="PayPal"
                            checked={paymentMethod === 'PayPal'}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                        />
                        PayPal or Credit Card
                    </label>
                </RadioGroup>

                <Button type="submit">Continue</Button>
            </form>
        </FormContainer>
    );
};

export default Payment;
