import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FiMapPin, FiArrowRight } from 'react-icons/fi';
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

const SectionLabel = styled.p`
  font-size: 0.75rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  font-weight: 700;
  color: var(--text-muted);
  margin: 1.25rem 0 0.25rem;

  &:first-of-type {
    margin-top: 0;
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
        <FormContainer
            title="Shipping"
            subtitle="Where should we deliver your order?"
            icon={<FiMapPin size={18} />}
        >
            <CheckoutSteps step1 step2 />

            <form onSubmit={submitHandler} style={{ marginTop: '0.5rem' }}>
                <SectionLabel>Street Address</SectionLabel>
                <Input
                    label="Address"
                    placeholder="123 Main Street, Apt 4B"
                    value={address}
                    required
                    onChange={(e) => setAddress(e.target.value)}
                />

                <FieldGrid>
                    <div>
                        <SectionLabel>City</SectionLabel>
                        <Input
                            label="City"
                            placeholder="New York"
                            value={city}
                            required
                            onChange={(e) => setCity(e.target.value)}
                        />
                    </div>
                    <div>
                        <SectionLabel>Postal Code</SectionLabel>
                        <Input
                            label="Postal Code"
                            placeholder="10001"
                            value={postalCode}
                            required
                            onChange={(e) => setPostalCode(e.target.value)}
                        />
                    </div>
                </FieldGrid>

                <SectionLabel>Country</SectionLabel>
                <Input
                    label="Country"
                    placeholder="United States"
                    value={country}
                    required
                    onChange={(e) => setCountry(e.target.value)}
                />

                <Button type="submit" style={{ marginTop: '1.5rem' }}>
                    <FiArrowRight size={16} />
                    Continue to Payment
                </Button>
            </form>
        </FormContainer>
    );
};

export default Shipping;
