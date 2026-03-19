import { useEffect } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { FiTrash2, FiArrowLeft, FiShoppingBag } from 'react-icons/fi';
import Button from '../components/Button';
import useCartStore from '../store/cartStore';
import api from '../services/api';

const Layout = styled.div`
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 2rem;
  align-items: start;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const PageTitle = styled.h1`
  font-size: 1.75rem;
  letter-spacing: -0.03em;
  margin-bottom: 1.5rem;
`;

const ItemsCard = styled.div`
  background: var(--bg-white);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  overflow: hidden;
`;

const CartItem = styled.div`
  display: grid;
  grid-template-columns: 72px 1fr auto auto auto;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid var(--border-light);
  transition: background 0.15s;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: var(--border-light);
  }

  @media (max-width: 480px) {
    grid-template-columns: 60px 1fr auto;
    grid-template-rows: auto auto;
  }
`;

const ItemImage = styled.img`
  width: 72px;
  height: 72px;
  border-radius: var(--radius-sm);
  object-fit: cover;
  background: var(--border-light);
`;

const ItemName = styled(Link)`
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--text);
  line-height: 1.4;
  transition: color 0.15s;

  &:hover {
    color: var(--text-muted);
  }
`;

const ItemPrice = styled.span`
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text);
  white-space: nowrap;
`;

const QtySelect = styled.select`
  padding: 0.3rem 0.5rem;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  font-size: 0.85rem;
  background: var(--bg-white);
  color: var(--text);
  cursor: pointer;
  transition: border-color 0.15s;

  &:focus {
    outline: none;
    border-color: var(--primary);
  }
`;

const RemoveBtn = styled.button`
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 0.3rem;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  transition:
    color 0.15s,
    background 0.15s;

  &:hover {
    color: var(--danger);
    background: #fef2f2;
  }
`;

const SummaryCard = styled.div`
  background: var(--bg-white);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
`;

const SummaryTitle = styled.h2`
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 1.25rem;
  letter-spacing: -0.02em;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
  margin-bottom: 0.75rem;
  color: var(--text-muted);

  &.total {
    font-size: 1.05rem;
    font-weight: 700;
    color: var(--text);
    border-top: 1px solid var(--border);
    padding-top: 1rem;
    margin-top: 0.25rem;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 5rem 2rem;
`;

const EmptyIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
  color: var(--border);
`;

const EmptyTitle = styled.h2`
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
`;

const EmptyText = styled.p`
  color: var(--text-muted);
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
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
        try {
          const { data } = await api.get(`/products/${id}`);
          addToCart({ ...data, _id: data._id }, qty);
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

  const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);
  const totalPrice = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2);

  if (cartItems.length === 0) {
    return (
      <EmptyState>
        <EmptyIcon>
          <FiShoppingBag />
        </EmptyIcon>
        <EmptyTitle>Your cart is empty</EmptyTitle>
        <EmptyText>Add some products to get started.</EmptyText>
        <Link
          to="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontWeight: 600,
            color: 'var(--text)',
            textDecoration: 'underline',
            textUnderlineOffset: '3px',
          }}
        >
          <FiArrowLeft size={15} /> Continue shopping
        </Link>
      </EmptyState>
    );
  }

  return (
    <>
      <Link
        to="/"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          fontSize: '0.875rem',
          fontWeight: 500,
          color: 'var(--text-muted)',
          marginBottom: '1.5rem',
        }}
      >
        <FiArrowLeft size={15} /> Continue shopping
      </Link>

      <PageTitle>Shopping Cart</PageTitle>

      <Layout>
        <div>
          <ItemsCard>
            {cartItems.map((item) => (
              <CartItem key={item._id}>
                <ItemImage src={item.image} alt={item.name} />
                <ItemName to={`/product/${item._id}`}>{item.name}</ItemName>
                <ItemPrice>${item.price}</ItemPrice>
                <QtySelect
                  value={item.qty}
                  onChange={(e) => addToCart(item, Number(e.target.value))}
                >
                  {[...Array(item.countInStock).keys()].map((x) => (
                    <option key={x + 1} value={x + 1}>
                      {x + 1}
                    </option>
                  ))}
                </QtySelect>
                <RemoveBtn onClick={() => removeFromCart(item._id)} title="Remove">
                  <FiTrash2 size={16} />
                </RemoveBtn>
              </CartItem>
            ))}
          </ItemsCard>
        </div>

        <SummaryCard>
          <SummaryTitle>Order Summary</SummaryTitle>
          <SummaryRow>
            <span>Items ({totalItems})</span>
            <span>${totalPrice}</span>
          </SummaryRow>
          <SummaryRow>
            <span>Shipping</span>
            <span style={{ color: 'var(--success)', fontWeight: 600 }}>Free</span>
          </SummaryRow>
          <SummaryRow className="total">
            <span>Total</span>
            <span>${totalPrice}</span>
          </SummaryRow>
          <div style={{ marginTop: '1.25rem' }}>
            <Button onClick={checkoutHandler} disabled={cartItems.length === 0}>
              Proceed to Checkout
            </Button>
          </div>
        </SummaryCard>
      </Layout>
    </>
  );
};

export default Cart;
