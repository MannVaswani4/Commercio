import styled from 'styled-components';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

const RatingContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: #f59e0b; /* Warning/Gold color */
  font-size: 0.875rem;
  margin: 0.5rem 0;

  span:last-child {
    color: var(--light-text);
    margin-left: 0.5rem;
    font-size: 0.8rem;
  }
`;

const Rating = ({ value, text }) => {
  return (
    <RatingContainer>
      <span>{value >= 1 ? <FaStar /> : value >= 0.5 ? <FaStarHalfAlt /> : <FaRegStar />}</span>
      <span>{value >= 2 ? <FaStar /> : value >= 1.5 ? <FaStarHalfAlt /> : <FaRegStar />}</span>
      <span>{value >= 3 ? <FaStar /> : value >= 2.5 ? <FaStarHalfAlt /> : <FaRegStar />}</span>
      <span>{value >= 4 ? <FaStar /> : value >= 3.5 ? <FaStarHalfAlt /> : <FaRegStar />}</span>
      <span>{value >= 5 ? <FaStar /> : value >= 4.5 ? <FaStarHalfAlt /> : <FaRegStar />}</span>
      <span>{text && text}</span>
    </RatingContainer>
  );
};

export default Rating;
