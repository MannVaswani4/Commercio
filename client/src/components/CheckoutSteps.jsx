import styled from 'styled-components';
import { FiCheck } from 'react-icons/fi';

const Wrapper = styled.nav`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  margin-bottom: 2rem;
`;

const StepWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
  min-width: 56px;
`;

const DotAndLine = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`;

const Dot = styled.div`
  width: 26px;
  height: 26px;
  border-radius: 50%;
  border: 2px solid ${p => p.$active ? 'var(--primary)' : 'var(--border)'};
  background: ${p => p.$active ? 'var(--primary)' : 'transparent'};
  color: ${p => p.$active ? '#fff' : 'var(--text-muted)'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.68rem;
  font-weight: 700;
  flex-shrink: 0;
  transition: all 0.2s;
`;

const Line = styled.div`
  flex: 1;
  height: 1.5px;
  background: ${p => p.$active ? 'var(--primary)' : 'var(--border)'};
`;

const Label = styled.span`
  font-size: 0.65rem;
  font-weight: 600;
  color: ${p => p.$active ? 'var(--text)' : 'var(--text-muted)'};
  white-space: nowrap;
  letter-spacing: 0.02em;
  text-align: center;
`;

const STEPS = [
  { key: 'step1', label: 'Sign In' },
  { key: 'step2', label: 'Shipping' },
  { key: 'step3', label: 'Payment' },
  { key: 'step4', label: 'Order' },
];

const CheckoutSteps = ({ step1, step2, step3, step4 }) => {
  const active = { step1, step2, step3, step4 };

  return (
    <Wrapper>
      {STEPS.map((s, i) => (
        <StepWrap key={s.key} style={{ flex: i < STEPS.length - 1 ? '1' : 'unset' }}>
          <DotAndLine>
            <Dot $active={active[s.key]}>
              {active[s.key] ? <FiCheck size={12} strokeWidth={3} /> : i + 1}
            </Dot>
            {i < STEPS.length - 1 && (
              <Line $active={active[s.key]} />
            )}
          </DotAndLine>
          <Label $active={active[s.key]}>{s.label}</Label>
        </StepWrap>
      ))}
    </Wrapper>
  );
};

export default CheckoutSteps;
