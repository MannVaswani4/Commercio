import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FiPackage, FiSearch, FiFilter, FiClock, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import api from '../services/api';

/* ─── Layout ─────────────────────────── */
const PageHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const Title = styled.h1`
  font-size: 1.75rem;
  font-weight: 800;
  letter-spacing: -0.03em;
`;

/* ─── Filters bar ────────────────────── */
const FiltersBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  align-items: center;
`;

const SearchBox = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--bg-white);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 0.5rem 0.9rem;
  flex: 1;
  min-width: 200px;
  max-width: 320px;

  input {
    border: none;
    background: none;
    outline: none;
    font-size: 0.875rem;
    color: var(--text);
    width: 100%;
    &::placeholder { color: var(--text-muted); }
  }
`;

const Select = styled.select`
  background: var(--bg-white);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 0.5rem 2rem 0.5rem 0.9rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text);
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.7rem center;
  min-width: 140px;
`;

const ResultCount = styled.span`
  font-size: 0.8rem;
  color: var(--text-muted);
  margin-left: auto;
`;

/* ─── Order cards ────────────────────── */
const OrderCard = styled.div`
  background: var(--bg-white);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  margin-bottom: 1rem;
  transition: box-shadow 0.2s;
  &:hover { box-shadow: var(--shadow-md); }
`;

const CardTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid var(--border-light);
`;

const OrderId = styled.span`
  font-size: 0.75rem;
  font-family: monospace;
  color: var(--text-muted);
`;

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  padding: 0.25rem 0.65rem;
  border-radius: 999px;
  background: ${p =>
    p.$status === 'delivered' ? '#ecfdf5' :
    p.$status === 'processing' ? '#eff6ff' :
    p.$status === 'cancelled' ? '#fef2f2' : '#fefce8'};
  color: ${p =>
    p.$status === 'delivered' ? '#059669' :
    p.$status === 'processing' ? '#2563eb' :
    p.$status === 'cancelled' ? '#dc2626' : '#ca8a04'};
`;

const CardBody = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 1rem;
  padding: 1rem 1.25rem;
  align-items: center;

  @media (max-width: 500px) { grid-template-columns: 1fr; }
`;

const ItemPreviews = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  img {
    width: 44px;
    height: 44px;
    border-radius: 8px;
    object-fit: cover;
    border: 1px solid var(--border);
  }
`;

const OrderMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  align-items: flex-end;
  @media (max-width: 500px) { align-items: flex-start; }
`;

const Delivery = styled.div`
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.78rem;
  color: var(--text-muted);
`;

const Total = styled.div`
  font-size: 1.05rem;
  font-weight: 700;
  letter-spacing: -0.02em;
`;

const ViewBtn = styled(Link)`
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--text-muted);
  &:hover { color: var(--text); }
`;

/* ─── Empty state ────────────────────── */
const Empty = styled.div`
  text-align: center;
  padding: 5rem 2rem;
  color: var(--text-muted);
  h2 { font-size: 1.1rem; font-weight: 700; margin: 1rem 0 0.5rem; color: var(--text); }
  p  { font-size: 0.875rem; margin-bottom: 1.5rem; }
`;

const ShopLink = styled(Link)`
  display: inline-block;
  padding: 0.6rem 1.4rem;
  background: var(--text);
  color: #fff;
  border-radius: var(--radius-md);
  font-weight: 600;
  font-size: 0.875rem;
`;

/* ═══════════════════════════════════════ */

const fmt = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

const getStatus = (order) => {
    if (order.isDelivered) return 'delivered';
    if (order.isCancelled) return 'cancelled';
    if (order.isPaid)      return 'processing';
    return 'pending';
};

const StatusIcon = ({ s }) => {
    if (s === 'delivered') return <FiCheckCircle size={11} />;
    if (s === 'cancelled') return <FiXCircle size={11} />;
    return <FiClock size={11} />;
};

const OrderHistory = () => {
    const [orders, setOrders]     = useState([]);
    const [loading, setLoading]   = useState(true);
    const [search, setSearch]     = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [sortBy, setSortBy]     = useState('newest');

    useEffect(() => {
        const fetch = async () => {
            try {
                const { data } = await api.get('/orders/myorders');
                setOrders(data);
            } catch {
                // Fallback: show empty state gracefully
                setOrders([]);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, []);

    const filtered = useMemo(() => {
        let result = [...orders];

        // Status filter
        if (statusFilter !== 'all') {
            result = result.filter(o => getStatus(o) === statusFilter);
        }

        // Search filter (by order ID or product name)
        if (search.trim()) {
            const q = search.toLowerCase();
            result = result.filter(o =>
                o._id.toLowerCase().includes(q) ||
                o.orderItems?.some(i => i.name?.toLowerCase().includes(q))
            );
        }

        // Sort
        result.sort((a, b) => {
            if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
            if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
            if (sortBy === 'highest') return b.totalPrice - a.totalPrice;
            if (sortBy === 'lowest') return a.totalPrice - b.totalPrice;
            return 0;
        });

        return result;
    }, [orders, statusFilter, search, sortBy]);

    if (loading) {
        return (
            <Empty>
                <FiPackage size={36} style={{ opacity: 0.3 }} />
                <h2>Loading orders…</h2>
            </Empty>
        );
    }

    const estDelivery = (createdAt) => {
        const d = new Date(createdAt);
        d.setDate(d.getDate() + 7);
        return fmt(d);
    };

    return (
        <div>
            <PageHeader>
                <Title>Order History</Title>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    {orders.length} total order{orders.length !== 1 ? 's' : ''}
                </span>
            </PageHeader>

            {/* ── Filters ── */}
            <FiltersBar>
                <SearchBox>
                    <FiSearch size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                    <input
                        placeholder="Search by order ID or product…"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </SearchBox>

                <Select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                </Select>

                <Select value={sortBy} onChange={e => setSortBy(e.target.value)}>
                    <option value="newest">Newest first</option>
                    <option value="oldest">Oldest first</option>
                    <option value="highest">Highest amount</option>
                    <option value="lowest">Lowest amount</option>
                </Select>

                <ResultCount>{filtered.length} result{filtered.length !== 1 ? 's' : ''}</ResultCount>
            </FiltersBar>

            {/* ── Empty state ── */}
            {orders.length === 0 && (
                <Empty>
                    <FiPackage size={40} style={{ opacity: 0.25 }} />
                    <h2>No orders yet</h2>
                    <p>Looks like you haven't placed any orders. Start shopping!</p>
                    <ShopLink to="/">Browse Products</ShopLink>
                </Empty>
            )}

            {orders.length > 0 && filtered.length === 0 && (
                <Empty>
                    <FiFilter size={32} style={{ opacity: 0.25 }} />
                    <h2>No orders match your filters</h2>
                    <p>Try clearing the search or changing the status filter.</p>
                </Empty>
            )}

            {/* ── Order cards ── */}
            {filtered.map(order => {
                const status = getStatus(order);
                return (
                    <OrderCard key={order._id}>
                        <CardTop>
                            <div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Order</div>
                                <OrderId>#{order._id.slice(-8).toUpperCase()}</OrderId>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{fmt(order.createdAt)}</span>
                                <StatusBadge $status={status}>
                                    <StatusIcon s={status} />
                                    {status}
                                </StatusBadge>
                            </div>
                        </CardTop>

                        <CardBody>
                            <ItemPreviews>
                                {(order.orderItems || []).slice(0, 5).map((item, i) => (
                                    <img key={i} src={item.image?.startsWith('http') ? item.image : `${import.meta.env.VITE_SERVER_URL || ''}${item.image}`} alt={item.name} />
                                ))}
                                {(order.orderItems?.length || 0) > 5 && (
                                    <div style={{ width: 44, height: 44, borderRadius: 8, background: 'var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                                        +{order.orderItems.length - 5}
                                    </div>
                                )}
                            </ItemPreviews>

                            <OrderMeta>
                                <Total>${Number(order.totalPrice).toFixed(2)}</Total>
                                <Delivery>
                                    <FiClock size={12} />
                                    Est. delivery: {estDelivery(order.createdAt)}
                                </Delivery>
                                <ViewBtn to={`/order/${order._id}`}>View details →</ViewBtn>
                            </OrderMeta>
                        </CardBody>
                    </OrderCard>
                );
            })}
        </div>
    );
};

export default OrderHistory;
