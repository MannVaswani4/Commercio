import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import Product from '../components/Product';
import api from '../services/api';
import { FiArrowRight } from 'react-icons/fi';

const Hero = styled.section`
  padding: 4.5rem 0 3.5rem;
  border-bottom: 1px solid var(--border);
  margin-bottom: 3.5rem;
`;

const HeroLabel = styled.p`
  font-size: 0.75rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  font-weight: 600;
  color: var(--text-muted);
  margin-bottom: 1rem;
`;

const HeroTitle = styled.h1`
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 1.05;
  color: var(--text);
  max-width: 700px;
  margin-bottom: 1.5rem;
`;

const HeroSubtitle = styled.p`
  font-size: 1.05rem;
  color: var(--text-muted);
  max-width: 480px;
  line-height: 1.7;
  margin-bottom: 2.5rem;
`;

const HeroAction = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--primary);
  color: #fff;
  font-weight: 600;
  font-size: 0.9rem;
  padding: 0.75rem 1.75rem;
  border-radius: var(--radius-sm);
  letter-spacing: 0.02em;
  cursor: pointer;
  transition: background 0.18s ease, transform 0.15s ease;

  &:hover {
    background: var(--accent-hover);
    transform: translateY(-1px);
  }
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 1.75rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--text);
`;

const ProductCount = styled.span`
  font-size: 0.85rem;
  color: var(--text-muted);
  font-weight: 500;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.25rem;

  @media (max-width: 1100px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const SkeletonCard = styled.div`
  background: var(--bg-white);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  overflow: hidden;
`;

const SkeletonImage = styled.div`
  aspect-ratio: 1 / 1;
  background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;

  @keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
`;

const SkeletonText = styled.div`
  margin: 1rem 1.1rem;
  height: 0.75rem;
  background: #e5e7eb;
  border-radius: 4px;
  width: ${p => p.w || '100%'};
`;

const LoadingGrid = () => (
  <Grid>
    {[...Array(8)].map((_, i) => (
      <SkeletonCard key={i}>
        <SkeletonImage />
        <SkeletonText w="60%" />
        <SkeletonText w="85%" />
        <SkeletonText w="40%" style={{ marginBottom: '1.5rem' }} />
      </SkeletonCard>
    ))}
  </Grid>
);

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get('/products');
        setProducts(data.products);
      } catch (err) {
        toast.error(err?.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <>
      <Hero>
        <HeroLabel>New Arrivals</HeroLabel>
        <HeroTitle>Premium Tech, Delivered.</HeroTitle>
        <HeroSubtitle>
          Discover curated electronics — from wireless audio to the latest smartphones — at transparent prices.
        </HeroSubtitle>
        <HeroAction href="#products">
          Shop Now <FiArrowRight size={16} />
        </HeroAction>
      </Hero>

      <div id="products">
        <SectionHeader>
          <SectionTitle>Latest Products</SectionTitle>
          {!loading && <ProductCount>{products.length} items</ProductCount>}
        </SectionHeader>

        {loading ? (
          <LoadingGrid />
        ) : (
          <Grid>
            {products.map((product) => (
              <Product key={product._id} product={product} />
            ))}
          </Grid>
        )}
      </div>
    </>
  );
};

export default Home;
