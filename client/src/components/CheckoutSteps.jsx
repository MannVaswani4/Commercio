import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FiCheck } from 'react-icons/fi';

const Wrapper = styled.nav`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;
  margin-bottom: 2.5rem;
`;

const Step = styled.div`
  display: flex;
  align-items: center;
`;

const StepDot = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 2px solid ${p => p.$active ? 'var(--primary)' : 'var(--border)'};
  background: ${p => p.$active ? 'var(--primary)' : 'transparent'};
  color: ${p => p.$active ? '#fff' : 'var(--text-muted)'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: 700;
  flex-shrink: 0;
  transition: all 0.2s;
`;

const StepLabel = styled.span`
  font-size: 0.8rem;
  font-weight: 600;
  color: ${p => p.$active ? 'var(--text)' : 'var(--text-muted)'};
  margin-left: 0.5rem;
  white-space: nowrap;
`;

const Connector = styled.div`
  height: 1.5px;
  width: 2.5rem;
  background: ${p => p.$active ? 'var(--primary)' : 'var(--border)'};
  margin: 0 0.5rem;
  flex-shrink: 0;
`;

const STEPS = [
  { key: 'step1', label: 'Sign In', to: '/login' },
  { key: 'step2', label: 'Shipping', to: '/shipping' },
  { key: 'step3', label: 'Payment', to: '/payment' },
  { key: 'step4', label: 'Order', to: '/placeorder' },
];

const CheckoutSteps = ({ step1, step2, step3, step4 }) => {
  const active = { step1, step2, step3, step4 };

  return (
    <Wrapper>
      {STEPS.map((s, i) => (
        <Step key={s.key}>
          {i > 0 && <Connector $active={active[STEPS[i - 1].key]} />}
          <StepDot $active={active[s.key]}>
            {active[s.key] ? <FiCheck size={13} strokeWidth={3} /> : i + 1}
          </StepDot>
          <StepLabel $active={active[s.key]}>{s.label}</StepLabel>
        </Step>
      ))}
    </Wrapper>
  );
};

export default CheckoutSteps;
