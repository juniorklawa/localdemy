import styled from 'styled-components';

export const Container = styled.div`
  flex-direction: column;
  background-color: #12181b;
  width: 80%;
  margin: auto;
`;

export const Title = styled.h1`
  color: #fff;
  font-family: OpenSans-ExtraBold;
  font-size: 42px;
`;

export const Toolbar = styled.div`
  padding: 8px;
  margin-top: 16px;
  flex-direction: row;
  display: flex;
  justify-content: space-between;
`;

export const EmptyListLabel = styled.p`
  align-self: center;
  font-family: OpenSans-Regular;
  color: #757575;
`;

export const LoadingLabel = styled.h1`
  align-self: center;
  font-family: OpenSans-Bold;
  color: #fff;
`;

export const EmptyListContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  height: 30vh;
  margin-top: 180px;
`;

export const Shrug = styled.img`
  margin: auto;
  width: 50%;
  opacity: 0.2;
`;
