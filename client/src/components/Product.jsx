import styled from 'styled-components';
import { Link } from 'react-router-dom';
import Rating from './Rating';
import { FiArrowRight } from 'react-icons/fi';
import { getImageUrl } from '../utils/imageUrl';

const Card = styled.div`
  background: var(--bg-white);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  overflow: hidden;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
  display: flex;
  flex-direction: column;
  height: 100%;

  &:hover {
    border-color: #C4C4C4;
    box-shadow: var(--shadow-md);
    transform: translateY(-2px);
  }
`;

const ImageLink = styled(Link)`
  display: block;
  aspect-ratio: 1 / 1;
  overflow: hidden;
  background: var(--border-light);
`;

const ProductImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;

  ${Card}:hover & {
    transform: scale(1.04);
  }
`;

const Content = styled.div`
  padding: 1rem 1.1rem 1.25rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  gap: 0.4rem;
`;

const Brand = styled.span`
  font-size: 0.72rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--text-muted);
  font-weight: 600;
`;

const ProductTitle = styled(Link)`
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.4;
  transition: color 0.15s;

  &:hover {
    color: var(--text-muted);
  }
`;

const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
  padding-top: 0.5rem;
`;

const Price = styled.span`
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text);
  letter-spacing: -0.02em;
`;

const ShopLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-muted);
  transition: color 0.15s;

  &:hover {
    color: var(--text);
  }
`;

const Product = ({ product }) => {
  return (
    <Card>
      <ImageLink to={`/product/${product._id}`}>
        <ProductImage
          src={getImageUrl(product.image)}
          alt={product.name}
          onError={(e) => {
            e.target.style.padding = '2rem';
            e.target.style.objectFit = 'contain';
          }}
        />
      </ImageLink>
      <Content>
        {product.brand && <Brand>{product.brand}</Brand>}
        <ProductTitle to={`/product/${product._id}`}>{product.name}</ProductTitle>
        <Rating value={product.rating} text={`${product.numReviews} reviews`} />
        <Footer>
          <Price>${product.price}</Price>
          <ShopLink to={`/product/${product._id}`}>
            View <FiArrowRight size={14} />
          </ShopLink>
        </Footer>
      </Content>
    </Card>
  );
};

export default Product;
