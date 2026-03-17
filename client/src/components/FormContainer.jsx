import styled from 'styled-components';

const Outer = styled.div`
  min-height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const Card = styled.div`
  background: var(--bg-white);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 2.5rem 2rem;
  width: 100%;
  max-width: 440px;

  @media (max-width: 480px) {
    padding: 2rem 1.25rem;
    border: none;
    box-shadow: none;
    background: transparent;
  }
`;

const Title = styled.h1`
  font-size: 1.6rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  margin-bottom: 0.25rem;
`;

const Subtitle = styled.p`
  font-size: 0.875rem;
  color: var(--text-muted);
  margin-bottom: 2rem;
`;

const FormContainer = ({ children, title, subtitle }) => {
  return (
    <Outer>
      <Card>
        {title && <Title>{title}</Title>}
        {subtitle && <Subtitle>{subtitle}</Subtitle>}
        {!subtitle && title && <div style={{ marginBottom: '1.75rem' }} />}
        {children}
      </Card>
    </Outer>
  );
};

export default FormContainer;
