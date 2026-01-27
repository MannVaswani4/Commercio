import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import Product from '../components/Product';
import api from '../services/api';

const HeroSection = styled.div`
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
  color: white;
  padding: 4rem 2rem;
  text-align: center;
  margin-bottom: 3rem;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);

  h1 {
    font-size: 3rem;
    margin-bottom: 1rem;
    font-weight: 700;
    
    @media (max-width: 768px) {
      font-size: 2rem;
    }
  }

  p {
    font-size: 1.2rem;
    opacity: 0.9;
    max-width: 600px;
    margin: 0 auto;
    
    @media (max-width: 768px) {
      font-size: 1rem;
    }
  }
`;

const PageTitle = styled.h2`
  margin-bottom: 2rem;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-size: 2rem;
  color: var(--secondary-color);
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  
  @media (max-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
  }
  
  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }
  
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const Loading = styled.div`
  text-align: center;
  padding: 3rem;
  font-size: 1.2rem;
  color: var(--light-text);
`;

const Home = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { data } = await api.get('/products');
                setProducts(data.products);
                setLoading(false);
            } catch (err) {
                toast.error(err?.response?.data?.message || err.message);
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    return (
        <>
            <HeroSection>
                <h1>Welcome to Commercio</h1>
                <p>Discover amazing products at unbeatable prices. Shop the latest tech, gadgets, and more!</p>
            </HeroSection>

            <PageTitle>Latest Products</PageTitle>
            {loading ? (
                <Loading>Loading products...</Loading>
            ) : (
                <ProductGrid>
                    {products.map((product) => (
                        <Product key={product._id} product={product} />
                    ))}
                </ProductGrid>
            )}
        </>
    );
};

export default Home;
