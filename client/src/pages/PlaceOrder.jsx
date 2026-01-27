import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import Button from '../components/Button';
import CheckoutSteps from '../components/CheckoutSteps';
import useCartStore from '../store/cartStore';
import api from '../services/api';

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const Summary = styled.div`
  background: var(--white);
  padding: 1.5rem;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);

  h2 {
    border-bottom: 1px solid var(--border-color);
    padding-bottom: 1rem;
    margin-bottom: 1rem;
  }
  
  .row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.8rem;
  }
`;

const ListGroup = styled.div`
    background: var(--white);
    padding: 1.5rem;
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-sm);
    margin-bottom: 1rem;

    h3 {
        margin-bottom: 1rem;
        color: var(--secondary-color);
    }
`;

const Item = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.8rem 0;
    border-bottom: 1px solid #f1f5f9;

    img {
        width: 50px;
        height: 50px;
        border-radius: 4px;
        object-fit: cover;
    }
`;

const PlaceOrder = () => {
    const navigate = useNavigate();
    const cart = useCartStore();

    // Calculate Prices
    const addDecimals = (num) => {
        return (Math.round(num * 100) / 100).toFixed(2);
    };

    cart.itemsPrice = addDecimals(
        cart.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
    );
    cart.shippingPrice = addDecimals(cart.itemsPrice > 100 ? 0 : 10);
    cart.taxPrice = addDecimals(Number((0.15 * cart.itemsPrice).toFixed(2)));
    cart.totalPrice = (
        Number(cart.itemsPrice) +
        Number(cart.shippingPrice) +
        Number(cart.taxPrice)
    ).toFixed(2);

    useEffect(() => {
        if (!cart.shippingAddress.address) {
            navigate('/shipping');
        } else if (!cart.paymentMethod) {
            navigate('/payment');
        }
    }, [cart.paymentMethod, cart.shippingAddress.address, navigate]);

    const placeOrderHandler = async () => {
        try {
            const res = await api.post('/orders', {
                orderItems: cart.cartItems,
                shippingAddress: cart.shippingAddress,
                paymentMethod: cart.paymentMethod,
                itemsPrice: cart.itemsPrice,
                shippingPrice: cart.shippingPrice,
                taxPrice: cart.taxPrice,
                totalPrice: cart.totalPrice,
            });
            cart.clearCart();
            toast.success('Order Placed Successfully');
            navigate(`/order/${res.data._id}`);
        } catch (err) {
            toast.error(err?.response?.data?.message || err.message);
        }
    };

    return (
        <>
            <CheckoutSteps step1 step2 step3 step4 />
            <Wrapper>
                <div>
                    <ListGroup>
                        <h3>Shipping</h3>
                        <p>
                            <strong>Address: </strong>
                            {cart.shippingAddress.address}, {cart.shippingAddress.city},{' '}
                            {cart.shippingAddress.postalCode}, {cart.shippingAddress.country}
                        </p>
                    </ListGroup>

                    <ListGroup>
                        <h3>Payment Method</h3>
                        <p>
                            <strong>Method: </strong>
                            {cart.paymentMethod}
                        </p>
                    </ListGroup>

                    <ListGroup>
                        <h3>Order Items</h3>
                        {cart.cartItems.length === 0 ? (
                            <p>Your cart is empty</p>
                        ) : (
                            <div>
                                {cart.cartItems.map((item, index) => (
                                    <Item key={index}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <img src={item.image} alt={item.name} />
                                            <Link to={`/product/${item._id}`}>{item.name}</Link>
                                        </div>
                                        <div>
                                            {item.qty} x ${item.price} = ${item.qty * item.price}
                                        </div>
                                    </Item>
                                ))}
                            </div>
                        )}
                    </ListGroup>
                </div>

                <div>
                    <Summary>
                        <h2>Order Summary</h2>
                        <div className="row">
                            <span>Items</span>
                            <span>${cart.itemsPrice}</span>
                        </div>
                        <div className="row">
                            <span>Shipping</span>
                            <span>${cart.shippingPrice}</span>
                        </div>
                        <div className="row">
                            <span>Tax</span>
                            <span>${cart.taxPrice}</span>
                        </div>
                        <div className="row" style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
                            <span>Total</span>
                            <span>${cart.totalPrice}</span>
                        </div>
                        <Button
                            style={{ marginTop: '1rem' }}
                            disabled={cart.cartItems.length === 0}
                            onClick={placeOrderHandler}
                        >
                            Place Order
                        </Button>
                    </Summary>
                </div>
            </Wrapper>
        </>
    );
};

export default PlaceOrder;
