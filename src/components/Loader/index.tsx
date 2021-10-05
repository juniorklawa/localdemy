import React from 'react';
import { Container, Title } from './styles';

const Loader: React.FC = () => {
  return (
    <Container>
      <Title style={{ color: '#fff', fontFamily: 'OpenSans-Bold' }}>
        Loading...
      </Title>
    </Container>
  );
};

export default Loader;
