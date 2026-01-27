import styled from 'styled-components';
import { Link } from 'react-router-dom';
import Rating from './Rating';

const Card = styled.div`
  background: var(--white);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
  height: 100%;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-lg);
  }
`;

const ImageContainer = styled(Link)`
  height: 200px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f1f5f9;

  img {
    max-height: 100%;
    max-width: 100%;
    object-fit: cover;
  }
`;

const Content = styled.div`
  padding: 1rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

const ProductTitle = styled(Link)`
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 0.5rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  
  &:hover {
    color: var(--accent-color);
  }
`;

const Price = styled.div`
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--primary-color);
  margin-top: auto;
`;

const Product = ({ product }) => {
    return (
        <Card>
            <ImageContainer to={`/product/${product._id}`}>
                <img src={product.image} alt={product.name} />
            </ImageContainer>
            <Content>
                <ProductTitle to={`/product/${product._id}`}>
                    {product.name}
                </ProductTitle>
                <Rating value={product.rating} text={`${product.numReviews} reviews`} />
                <Price>${product.price}</Price>
            </Content>
        </Card>
    );
};

export default Product;
