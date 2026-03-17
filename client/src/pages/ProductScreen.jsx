import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import Rating from '../components/Rating';
import Button from '../components/Button';
import api from '../services/api';
import { FiArrowLeft, FiPackage, FiCheckCircle, FiXCircle } from 'react-icons/fi';

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-muted);
  margin-bottom: 2rem;
  transition: color 0.15s;

  &:hover {
    color: var(--text);
  }
`;

const Layout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 340px;
  gap: 2.5rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ProductImageWrap = styled.div`
  background: var(--border-light);
  border-radius: var(--radius-lg);
  overflow: hidden;
  aspect-ratio: 4/3;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const Info = styled.div``;

const ProductName = styled.h1`
  font-size: 1.5rem;
  letter-spacing: -0.03em;
  margin-bottom: 0.75rem;
`;

const MetaRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 1.25rem;
`;

const PriceLabel = styled.span`
  font-size: 1.5rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: var(--text);
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid var(--border);
  margin: 1.25rem 0;
`;

const Description = styled.p`
  font-size: 0.9rem;
  color: var(--text-muted);
  line-height: 1.7;
`;

const PurchaseCard = styled.div`
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  background: var(--bg-white);
  height: fit-content;

  @media (max-width: 1024px) {
    grid-column: span 2;
  }

  @media (max-width: 768px) {
    grid-column: span 1;
  }
`;

const CardRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--border-light);
  font-size: 0.9rem;

  &:last-of-type {
    border-bottom: none;
  }

  strong {
    font-weight: 600;
  }
`;

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.8rem;
  font-weight: 600;
  color: ${p => p.$inStock ? 'var(--success)' : 'var(--danger)'};
`;

const QtySelect = styled.select`
  padding: 0.4rem 0.6rem;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  font-size: 0.9rem;
  color: var(--text);
  background: var(--bg-white);
  cursor: pointer;
  transition: border-color 0.15s;

  &:focus {
    outline: none;
    border-color: var(--primary);
  }
`;

const LoadingState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 40vh;
  font-size: 0.9rem;
  color: var(--text-muted);
`;

const ProductScreen = () => {
  const [product, setProduct] = useState({});
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/${id}`);
        setProduct(data);
      } catch (err) {
        toast.error(err?.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const addToCartHandler = () => {
    navigate(`/cart/${id}?qty=${qty}`);
  };

  if (loading) return <LoadingState>Loading product...</LoadingState>;

  return (
    <>
      <BackLink to="/"><FiArrowLeft size={15} /> Back to shop</BackLink>

      <Layout>
        <ProductImageWrap>
          <img src={product.image} alt={product.name} />
        </ProductImageWrap>

        <Info>
          <ProductName>{product.name}</ProductName>
          <MetaRow>
            <PriceLabel>${product.price}</PriceLabel>
            <Rating value={product.rating} text={`${product.numReviews} reviews`} />
          </MetaRow>
          <Divider />
          <Description>{product.description}</Description>
        </Info>

        <PurchaseCard>
          <CardRow>
            <span>Price</span>
            <strong>${product.price}</strong>
          </CardRow>
          <CardRow>
            <span>Status</span>
            <StatusBadge $inStock={product.countInStock > 0}>
              {product.countInStock > 0 ? (
                <><FiCheckCircle size={13} /> In Stock</>
              ) : (
                <><FiXCircle size={13} /> Out of Stock</>
              )}
            </StatusBadge>
          </CardRow>

          {product.countInStock > 0 && (
            <CardRow>
              <span>Quantity</span>
              <QtySelect value={qty} onChange={(e) => setQty(Number(e.target.value))}>
                {[...Array(Math.min(product.countInStock, 10)).keys()].map((x) => (
                  <option key={x + 1} value={x + 1}>{x + 1}</option>
                ))}
              </QtySelect>
            </CardRow>
          )}

          <div style={{ marginTop: '1.25rem' }}>
            <Button
              onClick={addToCartHandler}
              disabled={product.countInStock === 0}
            >
              <FiPackage size={16} />
              {product.countInStock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </Button>
          </div>
        </PurchaseCard>
      </Layout>
    </>
  );
};

export default ProductScreen;
