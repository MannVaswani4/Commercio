import { useEffect } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { FaTrash } from 'react-icons/fa';
import Button from '../components/Button';
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

const CartItems = styled.div`
  background: var(--white);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  padding: 1.5rem;
`;

const CartItem = styled.div`
  display: grid;
  grid-template-columns: 1fr 3fr 1fr 1fr 0.5fr;
  gap: 1rem;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid var(--border-color);
  
  &:last-child {
    border-bottom: none;
  }

  img {
    width: 60px;
    height: 60px;
    object-fit: cover;
    border-radius: var(--radius-sm);
  }

  a {
    font-weight: 500;
    &:hover {
      color: var(--accent-color);
    }
  }
`;

const Summary = styled.div`
  background: var(--white);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  padding: 1.5rem;
  height: fit-content;

  h2 {
    margin-bottom: 1.5rem;
    border-bottom: 1px solid var(--border-color);
    padding-bottom: 1rem;
  }

  .row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 1rem;
    font-size: 1.1rem;
  }
`;

const EmptyCart = styled.div`
    text-align: center;
    padding: 3rem;
    
    a {
        color: var(--accent-color);
        font-weight: 600;
        margin-left: 0.5rem;
    }
`;

const Cart = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const qty = Number(searchParams.get('qty')) || 1;

    const { cartItems, addToCart, removeFromCart } = useCartStore();

    useEffect(() => {
        const fetchProduct = async () => {
            if (id) {
                // Check if item already exists with correct qty to avoid re-fetch loop
                // But simplified: fetch product data and add to cart store
                try {
                    const { data } = await api.get(`/products/${id}`);
                    addToCart({ ...data, _id: data._id }, qty);
                    // clear URL param to avoid re-adding on refresh?
                    // navigate('/cart', { replace: true }); // Maybe better UI experience
                } catch (err) {
                    console.error(err);
                }
            }
        };
        fetchProduct();
    }, [id, qty, addToCart]);

    const checkoutHandler = () => {
        navigate('/login?redirect=/shipping');
    };

    if (cartItems.length === 0) {
        return (
            <EmptyCart>
                <h2>Your cart is empty</h2>
                <Link to="/">Go Back</Link>
            </EmptyCart>
        );
    }

    return (
        <Wrapper>
            <CartItems>
                <h1>Shopping Cart</h1>
                {cartItems.map((item) => (
                    <CartItem key={item._id}>
                        <img src={item.image} alt={item.name} />
                        <Link to={`/product/${item._id}`}>{item.name}</Link>
                        <span>${item.price}</span>
                        <select
                            value={item.qty}
                            onChange={(e) => addToCart(item, Number(e.target.value))}
                            style={{ padding: '0.25rem' }}
                        >
                            {[...Array(item.countInStock).keys()].map((x) => (
                                <option key={x + 1} value={x + 1}>
                                    {x + 1}
                                </option>
                            ))}
                        </select>
                        <button
                            onClick={() => removeFromCart(item._id)}
                            style={{ background: 'none', border: 'none', color: 'var(--danger)', fontSize: '1.2rem' }}
                        >
                            <FaTrash />
                        </button>
                    </CartItem>
                ))}
            </CartItems>

            <Summary>
                <h2>Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)}) items</h2>
                <div className="row">
                    <strong>Total:</strong>
                    <strong>
                        ${cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2)}
                    </strong>
                </div>
                <Button onClick={checkoutHandler} disabled={cartItems.length === 0}>
                    Proceed To Checkout
                </Button>
            </Summary>
        </Wrapper>
    );
};

export default Cart;
