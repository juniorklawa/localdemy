import styled from 'styled-components';
import ReactModal from 'react-modal';

export const Icon = styled.img`
  width: 128px;
  height: 128px;
  align-self: center;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.1);
  }
`;

export const StyledModal = styled(ReactModal)`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.8);
  overflow-x: hidden;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
`;

export const Container = styled.div`
  background-color: #0e1315;
  width: 35%;
  padding: 32px;
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  overflow: auto;
`;

export const Title = styled.h1`
  color: #fff;
  font-family: OpenSans-Bold;
  align-self: center;

  margin-top: 32px;
`;

export const Description = styled.p`
  color: #fff;
  text-align: start;
  font-family: OpenSans-Regular;
  margin-top: 8px;
`;

export const TotalLessons = styled.p`
  margin-top: 8px;
  color: #fff;
  font-family: OpenSans-Regular;
`;

export const Subtitle = styled.h2`
  color: #fff;
  font-family: OpenSans-Regular;
  margin-top: 16px;
`;

export const NiceButton = styled.button`
  color: #fff;
  background-color: #00c853;
  border-radius: 10px;
  margin-top: 32px;
  font-size: 20px;
  align-self: center;
  padding-right: 16px;
  width: 90%;
  padding-left: 16px;
  height: 50px;
  font-family: OpenSans-Bold;
`;
