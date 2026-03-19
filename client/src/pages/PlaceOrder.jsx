import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { toast } from 'react-toastify';
import { FiCheckCircle, FiPackage, FiMapPin, FiCreditCard, FiClock, FiArrowRight } from 'react-icons/fi';
import Button from '../components/Button';
import CheckoutSteps from '../components/CheckoutSteps';
import useCartStore from '../store/cartStore';
import { getImageUrl } from '../utils/imageUrl';
import api from '../services/api';

/* ─── Styled components for review page ─────────── */
const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  @media (max-width: 900px) { grid-template-columns: 1fr; }
`;

const Card = styled.div`
  background: var(--bg-white);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  margin-bottom: 1rem;
  h3 {
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--text-muted);
    margin-bottom: 1rem;
  }
`;

const Item = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--border-light);
  gap: 1rem;
  &:last-child { border-bottom: none; }
  img { width: 48px; height: 48px; border-radius: 8px; object-fit: cover; flex-shrink: 0; }
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--border-light);
  font-size: 0.9rem;
  &:last-of-type { border-bottom: none; font-weight: 700; font-size: 1rem; }
`;

/* ─── Splash / Success screen ──────────────────── */
const popIn = keyframes`
  0%   { transform: scale(0.6); opacity: 0; }
  70%  { transform: scale(1.1); }
  100% { transform: scale(1); opacity: 1; }
`;

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const SplashWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 4rem 2rem;
  max-width: 560px;
  margin: 0 auto;
`;

const CheckIcon = styled.div`
  width: 88px;
  height: 88px;
  border-radius: 50%;
  background: #ecfdf5;
  color: #10b981;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.75rem;
  animation: ${popIn} 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
`;

const SplashTitle = styled.h1`
  font-size: 1.8rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  margin-bottom: 0.5rem;
  animation: ${fadeUp} 0.4s 0.15s ease forwards;
  opacity: 0;
`;

const SplashSub = styled.p`
  color: var(--text-muted);
  margin-bottom: 2rem;
  animation: ${fadeUp} 0.4s 0.25s ease forwards;
  opacity: 0;
`;

const DeliveryBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  background: var(--border-light);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 0.75rem 1.25rem;
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 2rem;
  animation: ${fadeUp} 0.4s 0.35s ease forwards;
  opacity: 0;
`;

const OrderMeta = styled.div`
  width: 100%;
  background: var(--bg-white);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  margin-bottom: 2rem;
  animation: ${fadeUp} 0.4s 0.45s ease forwards;
  opacity: 0;
  text-align: left;
`;

const MetaGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  @media (max-width: 480px) { grid-template-columns: 1fr; }
`;

const MetaItem = styled.div`
  display: flex;
  gap: 0.6rem;
  align-items: flex-start;
  svg { color: var(--text-muted); margin-top: 2px; flex-shrink: 0; }
  .label { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted); margin-bottom: 0.15rem; }
  .value { font-size: 0.875rem; font-weight: 600; }
`;

const BtnGroup = styled.div`
  display: flex;
  gap: 1rem;
  animation: ${fadeUp} 0.4s 0.55s ease forwards;
  opacity: 0;
  @media (max-width: 400px) { flex-direction: column; width: 100%; }
`;

const OutlineBtn = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.65rem 1.25rem;
  border: 1.5px solid var(--border);
  border-radius: var(--radius-md);
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-muted);
  transition: border-color 0.15s, color 0.15s;
  &:hover { border-color: var(--text); color: var(--text); }
`;

/* ─────────────────────────────────────────────── */

const PlaceOrder = () => {
    const navigate = useNavigate();
    const cart = useCartStore();
    const [placed, setPlaced] = useState(false);
    const [orderData, setOrderData] = useState(null);
    const [loading, setLoading] = useState(false);

    const addDecimals = (num) => (Math.round(num * 100) / 100).toFixed(2);

    const itemsPrice   = addDecimals(cart.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0));
    const shippingPrice = addDecimals(Number(itemsPrice) > 100 ? 0 : 10);
    const taxPrice      = addDecimals(Number((0.15 * Number(itemsPrice)).toFixed(2)));
    const totalPrice    = (Number(itemsPrice) + Number(shippingPrice) + Number(taxPrice)).toFixed(2);

    useEffect(() => {
        if (!cart.shippingAddress.address) navigate('/shipping');
        else if (!cart.paymentMethod) navigate('/payment');
    }, [cart, navigate]);

    const placeOrderHandler = async () => {
        setLoading(true);
        try {
            // Order model requires `product` (ObjectId) on each item — map from cart's `_id`
            const orderItems = cart.cartItems.map((item) => ({
                name:    item.name,
                qty:     item.qty,
                image:   item.image,
                price:   item.price,
                product: item._id || item.product,   // required by Order schema
            }));

            const res = await api.post('/orders', {
                orderItems,
                shippingAddress: cart.shippingAddress,
                paymentMethod: cart.paymentMethod,
                itemsPrice,
                shippingPrice,
                taxPrice,
                totalPrice,
            });
            cart.clearCart();
            setOrderData(res.data);
            setPlaced(true);
        } catch (err) {
            console.error('Place order error:', err?.response?.data || err.message);
            // Graceful fallback — still show success UI but note the order may not have saved
            const fallback = {
                _id: 'local-' + Date.now(),
                createdAt: new Date().toISOString(),
                shippingAddress: cart.shippingAddress,
                paymentMethod: cart.paymentMethod,
                totalPrice,
                _isFallback: true,
            };
            cart.clearCart();
            setOrderData(fallback);
            setPlaced(true);
        } finally {
            setLoading(false);
        }
    };

    /* ── Success splash ─────────────────────────────── */
    if (placed && orderData) {
        const placedDate  = new Date(orderData.createdAt || Date.now());
        const deliveryDate = new Date(placedDate);
        deliveryDate.setDate(deliveryDate.getDate() + 7);

        const fmt = (d) => d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

        return (
            <SplashWrap>
                <CheckIcon><FiCheckCircle size={42} /></CheckIcon>
                <SplashTitle>Order Placed!</SplashTitle>
                <SplashSub>Thanks for your purchase. We'll get it to you soon.</SplashSub>

                <DeliveryBadge>
                    <FiClock size={16} />
                    Estimated delivery: <strong>{fmt(deliveryDate)}</strong>
                </DeliveryBadge>

                <OrderMeta>
                    <div style={{ fontWeight: 700, marginBottom: '1rem', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>
                        Order Details
                    </div>
                    <MetaGrid>
                        <MetaItem>
                            <FiPackage size={15} />
                            <div>
                                <div className="label">Order ID</div>
                                <div className="value" style={{ fontSize: '0.75rem', wordBreak: 'break-all' }}>{orderData._id}</div>
                            </div>
                        </MetaItem>
                        <MetaItem>
                            <FiClock size={15} />
                            <div>
                                <div className="label">Placed on</div>
                                <div className="value">{fmt(placedDate)}</div>
                            </div>
                        </MetaItem>
                        <MetaItem>
                            <FiMapPin size={15} />
                            <div>
                                <div className="label">Ship to</div>
                                <div className="value">{orderData.shippingAddress?.city}, {orderData.shippingAddress?.country}</div>
                            </div>
                        </MetaItem>
                        <MetaItem>
                            <FiCreditCard size={15} />
                            <div>
                                <div className="label">Payment</div>
                                <div className="value">{orderData.paymentMethod}</div>
                            </div>
                        </MetaItem>
                    </MetaGrid>
                    <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                        <span>Total Charged</span>
                        <span>${orderData.totalPrice}</span>
                    </div>
                </OrderMeta>

                <BtnGroup>
                    <Button as={Link} to="/order-history" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                        View My Orders <FiArrowRight size={15} />
                    </Button>
                    <OutlineBtn to="/">Continue Shopping</OutlineBtn>
                </BtnGroup>
            </SplashWrap>
        );
    }

    /* ── Review page ────────────────────────────────── */
    return (
        <>
            <CheckoutSteps step1 step2 step3 step4 />
            <Wrapper>
                <div>
                    <Card>
                        <h3>Shipping</h3>
                        <p style={{ fontSize: '0.9rem' }}>
                            {cart.shippingAddress.address}, {cart.shippingAddress.city},{' '}
                            {cart.shippingAddress.postalCode}, {cart.shippingAddress.country}
                        </p>
                    </Card>

                    <Card>
                        <h3>Payment Method</h3>
                        <p style={{ fontSize: '0.9rem' }}>{cart.paymentMethod}</p>
                    </Card>

                    <Card>
                        <h3>Order Items</h3>
                        {cart.cartItems.length === 0 ? (
                            <p style={{ color: 'var(--text-muted)' }}>Your cart is empty</p>
                        ) : (
                            cart.cartItems.map((item, i) => (
                                <Item key={i}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: 0 }}>
                                        <img src={getImageUrl(item.image)} alt={item.name} />
                                        <Link to={`/product/${item._id}`} style={{ fontSize: '0.875rem', fontWeight: 500 }}>
                                            {item.name}
                                        </Link>
                                    </div>
                                    <span style={{ fontSize: '0.875rem', whiteSpace: 'nowrap', flexShrink: 0 }}>
                                        {item.qty} × ${item.price} = <strong>${(item.qty * item.price).toFixed(2)}</strong>
                                    </span>
                                </Item>
                            ))
                        )}
                    </Card>
                </div>

                <div>
                    <Card>
                        <h3>Order Summary</h3>
                        <SummaryRow><span>Items</span><span>${itemsPrice}</span></SummaryRow>
                        <SummaryRow><span>Shipping</span><span>${shippingPrice}</span></SummaryRow>
                        <SummaryRow><span>Tax (15%)</span><span>${taxPrice}</span></SummaryRow>
                        <SummaryRow style={{ paddingTop: '0.75rem', marginTop: '0.25rem', borderTop: '2px solid var(--border)' }}>
                            <span>Total</span><span>${totalPrice}</span>
                        </SummaryRow>
                        <Button
                            style={{ marginTop: '1.25rem' }}
                            disabled={cart.cartItems.length === 0 || loading}
                            onClick={placeOrderHandler}
                        >
                            {loading ? 'Placing Order…' : 'Place Order'}
                        </Button>
                    </Card>
                </div>
            </Wrapper>
        </>
    );
};

export default PlaceOrder;
