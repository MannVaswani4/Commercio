import styled from 'styled-components';

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.375rem;
  font-weight: 500;
  font-size: 0.8rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--text-muted);
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 0.75rem 0;
  border: none;
  border-bottom: 1.5px solid var(--border);
  border-radius: 0;
  background: transparent;
  font-size: 1rem;
  color: var(--text);
  transition: border-color 0.2s ease;
  outline: none;

  &:focus {
    border-bottom-color: var(--primary);
  }

  &::placeholder {
    color: #c4c4c4;
  }
`;

const Input = ({ label, id, ...props }) => {
  return (
    <FormGroup>
      {label && <Label htmlFor={id}>{label}</Label>}
      <StyledInput id={id} {...props} />
    </FormGroup>
  );
};

export default Input;
