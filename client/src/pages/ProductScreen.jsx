import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import Rating from '../components/Rating';
import Button from '../components/Button';
import api from '../services/api';

const BackLink = styled(Link)`
  display: inline-block;
  margin-bottom: 2rem;
  color: var(--light-text);
  font-weight: 500;
  &:hover {
    color: var(--primary-color);
  }
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr;
  gap: 2rem;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const Image = styled.img`
  width: 100%;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
`;

const Info = styled.div`
  h3 {
    font-size: 1.8rem;
    color: var(--text-color);
    margin-bottom: 1rem;
  }
  
  p {
    margin-bottom: 1rem;
    color: var(--light-text);
  }
`;

const CartCard = styled.div`
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 1.5rem;
  box-shadow: var(--shadow-sm);
  background: var(--white);
  height: fit-content;

  .row {
    display: flex;
    justify-content: space-between;
    padding: 0.75rem 0;
    border-bottom: 1px solid #f1f5f9;
    font-weight: 500;
    
    &:last-child {
      border-bottom: none;
    }
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.5rem;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border-color);
  margin-bottom: 1rem;
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
                setLoading(false);
            } catch (err) {
                toast.error(err?.response?.data?.message || err.message);
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const addToCartHandler = () => {
        // We haven't implemented Cart context/store yet, so just navigate for now or store in LS
        // Plan: Use navigate to cart page with query params or update state
        navigate(`/cart/${id}?qty=${qty}`);
    };

    if (loading) return <h2>Loading...</h2>;

    return (
        <>
            <BackLink to="/">Go Back</BackLink>
            <ProductGrid>
                <Image src={product.image} alt={product.name} />

                <Info>
                    <h3>{product.name}</h3>
                    <Rating value={product.rating} text={`${product.numReviews} reviews`} />
                    <p>Price: ${product.price}</p>
                    <p>Description: {product.description}</p>
                </Info>

                <CartCard>
                    <div className="row">
                        <span>Price:</span>
                        <span><strong>${product.price}</strong></span>
                    </div>
                    <div className="row">
                        <span>Status:</span>
                        <span>{product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}</span>
                    </div>

                    {product.countInStock > 0 && (
                        <div className="row" style={{ display: 'block', border: 'none' }}>
                            <span style={{ display: 'block', marginBottom: '0.5rem' }}>Qty</span>
                            <Select value={qty} onChange={(e) => setQty(Number(e.target.value))}>
                                {[...Array(product.countInStock).keys()].map((x) => (
                                    <option key={x + 1} value={x + 1}>
                                        {x + 1}
                                    </option>
                                ))}
                            </Select>
                        </div>
                    )}

                    <Button
                        onClick={addToCartHandler}
                        disabled={product.countInStock === 0}
                        style={{ marginTop: '1rem' }}
                    >
                        Add To Cart
                    </Button>
                </CartCard>
            </ProductGrid>
        </>
    );
};

export default ProductScreen;
