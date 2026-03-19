import styled from 'styled-components';

const StyledButton = styled.button`
  background: var(--primary);
  color: #fff;
  border: 1.5px solid var(--primary);
  padding: 0.75rem 1.75rem;
  border-radius: var(--radius-sm);
  font-weight: 600;
  font-size: 0.9rem;
  letter-spacing: 0.02em;
  width: 100%;
  transition:
    background 0.18s ease,
    transform 0.15s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover:not(:disabled) {
    background: var(--accent-hover);
    border-color: var(--accent-hover);
    transform: translateY(-1px);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    background: #d1d5db;
    border-color: #d1d5db;
    color: #9ca3af;
    cursor: not-allowed;
  }
`;

const Button = ({ children, ...props }) => {
  return <StyledButton {...props}>{children}</StyledButton>;
};

export default Button;
