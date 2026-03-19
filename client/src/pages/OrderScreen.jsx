import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import Button from '../components/Button';
import api from '../services/api';
import useAuthStore from '../store/authStore';

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

const Message = styled.div`
  padding: 1rem;
  border-radius: var(--radius-sm);
  margin-bottom: 1rem;
  background-color: ${(props) => (props.variant === 'danger' ? '#fee2e2' : '#dcfce7')};
  color: ${(props) => (props.variant === 'danger' ? '#b91c1c' : '#15803d')};
`;

const OrderScreen = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const { userInfo } = useAuthStore();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await api.get(`/orders/${id}`);
        setOrder(data);
        setLoading(false);
      } catch (err) {
        toast.error(err?.response?.data?.message || err.message);
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  const payHandler = async () => {
    try {
      await api.put(`/orders/${order._id}/pay`, {
        id: 'PAYPAL_SIMULATION',
        status: 'COMPLETED',
        update_time: new Date().toISOString(),
        email_address: userInfo.email,
      });
      toast.success('Payment Successful');
      setLoading(true); // Trigger re-render/fetch
      const { data } = await api.get(`/orders/${id}`);
      setOrder(data);
      setLoading(false);
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message);
    }
  };

  const deliverHandler = async () => {
    try {
      await api.put(`/orders/${order._id}/deliver`);
      toast.success('Order Delivered');
      setLoading(true);
      const { data } = await api.get(`/orders/${id}`);
      setOrder(data);
      setLoading(false);
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message);
    }
  };

  if (loading) return <h2>Loading...</h2>;
  if (!order) return <h2>Order not Found</h2>;

  return (
    <Wrapper>
      <div>
        <h1>Order ID: {order._id}</h1>
        <ListGroup>
          <h3>Shipping</h3>
          <p>
            <strong>Name: </strong> {order.user.name}
          </p>
          <p>
            <strong>Email: </strong> <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
          </p>
          <p>
            <strong>Address: </strong>
            {order.shippingAddress.address}, {order.shippingAddress.city},{' '}
            {order.shippingAddress.postalCode}, {order.shippingAddress.country}
          </p>
          {order.isDelivered ? (
            <Message variant="success">Delivered on {order.deliveredAt}</Message>
          ) : (
            <Message variant="danger">Not Delivered</Message>
          )}
        </ListGroup>

        <ListGroup>
          <h3>Payment Method</h3>
          <p>
            <strong>Method: </strong>
            {order.paymentMethod}
          </p>
          {order.isPaid ? (
            <Message variant="success">Paid on {order.paidAt}</Message>
          ) : (
            <Message variant="danger">Not Paid</Message>
          )}
        </ListGroup>

        <ListGroup>
          <h3>Order Items</h3>
          {order.orderItems.length === 0 ? (
            <p>Order is empty</p>
          ) : (
            <div>
              {order.orderItems.map((item, index) => (
                <Item key={index}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <img src={item.image} alt={item.name} />
                    <Link to={`/product/${item.product}`}>{item.name}</Link>
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
            <span>${order.itemsPrice}</span>
          </div>
          <div className="row">
            <span>Shipping</span>
            <span>${order.shippingPrice}</span>
          </div>
          <div className="row">
            <span>Tax</span>
            <span>${order.taxPrice}</span>
          </div>
          <div className="row" style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
            <span>Total</span>
            <span>${order.totalPrice}</span>
          </div>
          {!order.isPaid && (
            <Button style={{ marginTop: '1rem' }} onClick={payHandler}>
              Pay Order (Simulate)
            </Button>
          )}
          {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
            <Button style={{ marginTop: '1rem' }} onClick={deliverHandler}>
              Mark As Delivered
            </Button>
          )}
        </Summary>
      </div>
    </Wrapper>
  );
};

export default OrderScreen;
