import styled from 'styled-components';
import ReactModal from 'react-modal';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0px;
  flex: 1;
  padding: 0px;
`;

export const Toolbar = styled.div`
  display: flex;
  flex-direction: row;
  background-color: #263238;
  align-items: center;
  padding: 16px;
  justify-content: space-between;
`;

export const NavigationContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

export const OptionsContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 10%;
  justify-content: space-between;
`;

export const OptionButton = styled.button`
  font-family: OpenSans-Regular;
  color: #fff;
  align-items: center;
  justify-content: center;
  display: flex;
`;

export const ClassesContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #212121;
  width: 25%;
  height: 100vh;
  align-items: center;
  border-width: 3px;
  overflow: auto;
  border: 1px solid #263238;
`;

export const VideoContainer = styled.div`
  width: 75%;
  height: 100%;
`;

export const LessonTitle = styled.h2`
  color: #fff;
  font-family: OpenSans-Bold;
`;

export const BottomTab = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  flex: 1;
  padding: 16px;
  width: 100%;
`;

export const ContentContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

export const OptionButtonLabel = styled.p`
  margin-right: 8px;
`;

export const CourseTitle = styled.h2`
  color: #fff;
  font-family: OpenSans-ExtraBold;
  margin-left: 8px;
`;

export const GoBackButton = styled.button`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

export const Icon = styled.img`
  width: 20px;
  height: 20px;

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
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.8);
  overflow-x: hidden;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
`;

export const ModalContainer = styled.div`
  background-color: '#fff';
  max-width: 700px;
  display: flex;
  padding: 3em 2em;
`;
