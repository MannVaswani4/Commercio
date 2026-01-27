import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FormContainer from '../components/FormContainer';
import Button from '../components/Button';
import Input from '../components/Input';
import CheckoutSteps from '../components/CheckoutSteps';
import useCartStore from '../store/cartStore';

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
        <FormContainer title="Shipping">
            <CheckoutSteps step1 step2 />
            <form onSubmit={submitHandler}>
                <Input
                    label="Address"
                    value={address}
                    required
                    onChange={(e) => setAddress(e.target.value)}
                />
                <Input
                    label="City"
                    value={city}
                    required
                    onChange={(e) => setCity(e.target.value)}
                />
                <Input
                    label="Postal Code"
                    value={postalCode}
                    required
                    onChange={(e) => setPostalCode(e.target.value)}
                />
                <Input
                    label="Country"
                    value={country}
                    required
                    onChange={(e) => setCountry(e.target.value)}
                />

                <Button type="submit">Continue</Button>
            </form>
        </FormContainer>
    );
};

export default Shipping;
