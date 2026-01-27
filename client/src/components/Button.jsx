import styled from 'styled-components';

const StyledButton = styled.button`
  background: var(--primary-color);
  color: var(--white);
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: var(--radius-md);
  font-weight: 600;
  font-size: 1rem;
  width: 100%;
  transition: all 0.2s;
  
  &:hover {
    background: var(--secondary-color);
    transform: translateY(-1px);
    box-shadow: var(--shadow-md);
  }

  &:disabled {
    background: #94A3B8;
    cursor: not-allowed;
    transform: none;
  }
`;

const Button = ({ children, ...props }) => {
    return <StyledButton {...props}>{children}</StyledButton>;
};

export default Button;
