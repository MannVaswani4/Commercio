import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
`;

const FormWrapper = styled.div`
  background: var(--white);
  padding: 2.5rem;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  width: 100%;
  max-width: 500px;
  
  h1 {
    text-align: center;
    margin-bottom: 2rem;
    color: var(--primary-color);
  }
`;

const FormContainer = ({ children, title }) => {
    return (
        <Container>
            <FormWrapper>
                {title && <h1>{title}</h1>}
                {children}
            </FormWrapper>
        </Container>
    );
};

export default FormContainer;
