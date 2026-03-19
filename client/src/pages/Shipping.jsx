import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FiArrowRight } from 'react-icons/fi';
import FormContainer from '../components/FormContainer';
import Button from '../components/Button';
import Input from '../components/Input';
import CheckoutSteps from '../components/CheckoutSteps';
import useCartStore from '../store/cartStore';

const FieldGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0 1.5rem;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const Shipping = () => {
  const { shippingAddress, saveShippingAddress } = useCartStore();
  const navigate = useNavigate();

  const [address, setAddress] = useState(shippingAddress.address || '');
  const [city, setCity] = useState(shippingAddress.city || '');
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || '');
  const [country, setCountry] = useState(shippingAddress.country || '');

  const submitHandler = (e) => {
    e.preventDefault();
    saveShippingAddress({ address, city, postalCode, country });
    navigate('/payment');
  };

  return (
    <FormContainer title="Shipping" subtitle="Where should we deliver your order?">
      <CheckoutSteps step1 step2 />

      <form onSubmit={submitHandler} style={{ marginTop: '1.25rem' }}>
        <Input
          label="Street Address"
          placeholder="123 Main Street"
          value={address}
          required
          onChange={(e) => setAddress(e.target.value)}
        />

        <FieldGrid>
          <Input
            label="City"
            placeholder="New York"
            value={city}
            required
            onChange={(e) => setCity(e.target.value)}
          />
          <Input
            label="Postal Code"
            placeholder="10001"
            value={postalCode}
            required
            onChange={(e) => setPostalCode(e.target.value)}
          />
        </FieldGrid>

        <Input
          label="Country"
          placeholder="United States"
          value={country}
          required
          onChange={(e) => setCountry(e.target.value)}
        />

        <Button type="submit" style={{ marginTop: '0.5rem' }}>
          <FiArrowRight size={16} style={{ marginRight: '0.4rem' }} />
          Continue to Payment
        </Button>
      </form>
    </FormContainer>
  );
};

export default Shipping;
